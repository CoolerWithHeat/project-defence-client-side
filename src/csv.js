export function DownloadCSV(data, fileName) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('Invalid data provided');
      return;
    }
  
    const headers = Object.keys(data[0]);

    const csvContent =
      headers.join(',') +
      '\n' +
      data
        .map(item => {
          return headers.map(header => {
            return item[header];
          }).join(',');
        })
        .join('\n');
  
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName || 'exported_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}