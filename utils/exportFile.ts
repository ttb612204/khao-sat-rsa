import * as XLSX from 'xlsx';
import { QUESTIONS } from '@/constants/survey';
import dayjs from 'dayjs';

export const exportToExcel = (responses: any[]) => {
  if (responses.length === 0) return;

  const excelData = responses.map((item, index) => {
    const data = item.data || item;
    const row: any = {
      'STT': index + 1,
      'Thời gian nộp': dayjs(item.submittedAt).format('DD/MM/YYYY HH:mm:ss'),
    };

    QUESTIONS.forEach(q => {
      const val = data[q.id];
      if (q.id === 'q21' && Array.isArray(val)) {
        row[`${q.number}. ${q.label}`] = val
          .filter(v => v.name || v.phone || v.email)
          .map(v => `${v.field}: ${v.name || 'N/A'} - SĐT: ${v.phone || 'N/A'}`)
          .join('\n');
      } else if (Array.isArray(val)) {
        row[`${q.number}. ${q.label}`] = val.join(', ');
      } else {
        row[`${q.number}. ${q.label}`] = val || '';
      }
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ket-qua-khao-sat');
  
  XLSX.writeFile(workbook, `VABSO-Khao-sat-${dayjs().format('YYYY-MM-DD')}.xlsx`);
};
