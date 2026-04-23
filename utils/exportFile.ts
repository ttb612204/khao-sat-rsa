import * as XLSX from 'xlsx';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType,
  BorderStyle,
  AlignmentType
} from 'docx';
import { saveAs } from 'file-saver';
import { SurveyData } from '@/types/survey';
import { QUESTIONS, SECTIONS, SURVEY_TITLE } from '@/constants/survey';

/**
 * EXPORT TO EXCEL
 */
export const exportToExcel = (data: SurveyData, fileName: string) => {
  // Chuẩn bị dữ liệu: Flatten object để đưa vào Excel
  const exportData: Record<string, string> = {};
  
  QUESTIONS.forEach(q => {
    const value = data[q.id as keyof SurveyData];
    exportData[`${q.number}. ${q.label}`] = Array.isArray(value) ? value.join(', ') : (value as string) || '';
    
    // Thêm các trường detail/other nếu có
    if (q.id === 'q14' && data.q14_detail) exportData['14. Chi tiết liên hệ'] = data.q14_detail;
    if (q.id === 'q15' && data.q15_other) exportData['15. Lĩnh vực quan tâm khác'] = data.q15_other;
    if (q.id === 'q23' && data.q23_other) exportData['23. Nhu cầu hỗ trợ khác'] = data.q23_other;
  });

  // Xử lý Phần 4 (Bảng)
  data.q21.forEach((cp, index) => {
    exportData[`P4.${index+1} Lĩnh vực`] = cp.field;
    exportData[`P4.${index+1} Họ tên`] = cp.name;
    exportData[`P4.${index+1} Chức danh`] = cp.position;
    exportData[`P4.${index+1} SĐT/Email`] = cp.phoneEmail;
  });

  const worksheet = XLSX.utils.json_to_sheet([exportData]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SurveyData');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * EXPORT TO WORD (DOCX)
 */
export const exportToDocx = async (data: SurveyData, fileName: string) => {
  const sections = SECTIONS.map(section => {
    const children: any[] = [
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
    ];

    if (section.id === 'section4') {
      const rows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'Lĩnh vực', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: 'Họ tên', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: 'Chức danh', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: 'SĐT và Email', bold: true })] }),
          ],
        }),
        ...data.q21.map(cp => new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(cp.field)] }),
            new TableCell({ children: [new Paragraph(cp.name)] }),
            new TableCell({ children: [new Paragraph(cp.position)] }),
            new TableCell({ children: [new Paragraph(cp.phoneEmail)] }),
          ],
        })),
      ];

      children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rows,
      }));
    } else {
      section.questions.forEach(qId => {
        const q = QUESTIONS.find(item => item.id === qId);
        if (q) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${q.number}. ${q.label}: `, bold: true }),
                new TextRun({ 
                  text: Array.isArray(data[qId as keyof SurveyData]) 
                    ? (data[qId as keyof SurveyData] as string[]).join(', ') 
                    : (data[qId as keyof SurveyData] as string) || '(Trống)' 
                }),
              ],
              spacing: { after: 120 },
            })
          );

          // Handle detail fields
          if (qId === 'q14' && data.q14_detail) {
            children.push(new Paragraph({ text: `   - Chi tiết: ${data.q14_detail}`, italics: true }));
          }
          if (qId === 'q15' && data.q15_other) {
            children.push(new Paragraph({ text: `   - Khác: ${data.q15_other}`, italics: true }));
          }
          if (qId === 'q23' && data.q23_other) {
            children.push(new Paragraph({ text: `   - Khác: ${data.q23_other}`, italics: true }));
          }
        }
      });
    }

    return children;
  }).flat();

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: SURVEY_TITLE,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        ...sections
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileName}.docx`);
};
