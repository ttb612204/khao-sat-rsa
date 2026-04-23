export const exportToJson = (data: any, fileName: string) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement('a');
  link.href = jsonString;
  link.download = `${fileName}.json`;
  link.click();
};

export const importFromJson = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        resolve(json);
      } catch (err) {
        reject(new Error('File JSON không đúng định dạng'));
      }
    };
    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.readAsText(file);
  });
};
