import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export class ExcelExporter {

  static export(
    title: string,
    columns: ExcelColumn[],
    data: any[],
    filename: string,
    filtersText?: string
  ) {

    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('Reporte');

    const totalCols = columns.length;
    const lastCol = sheet.getColumn(totalCols).letter;

    let currentRow = 1;

    // ========================================
    // 1. TÍTULO
    // ========================================
    sheet.getRow(currentRow).getCell(1).value = title;
    sheet.mergeCells(currentRow, 1, currentRow, totalCols);

    const titleCell = sheet.getRow(currentRow).getCell(1);
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0D47A1' }
    };

    currentRow++;

    // ========================================
    // 2. FILTROS (si existen)
    // ========================================
    if (filtersText) {
      sheet.getRow(currentRow).getCell(1).value = `Filtros aplicados: ${filtersText}`;
      sheet.mergeCells(currentRow, 1, currentRow, totalCols);

      const filterCell = sheet.getRow(currentRow).getCell(1);
      filterCell.font = { italic: true, size: 11, color: { argb: 'FF424242' } };
      filterCell.alignment = { horizontal: 'left' };

      currentRow++;
    }

    // fila en blanco
    currentRow++;

    // ========================================
    // 3. DEFINIR ANCHO DE COLUMNAS (sin headers)
    // ========================================
    sheet.columns = columns.map(col => ({
      key: col.key,
      width: col.width || 20
    }));

    // ========================================
    // 4. CREAR HEADERS MANUALMENTE
    // ========================================
    const headerRow = sheet.getRow(currentRow);

    columns.forEach((col, index) => {
      headerRow.getCell(index + 1).value = col.header;
    });

    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1565C0' }
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    currentRow++;

    // ========================================
    // 5. DATOS
    // ========================================
    const dataStartRow = currentRow;
    data.forEach(row => {
      sheet.addRow(row);

    });
    // ========================================
    // BORDES PARA TODA LA DATA
    // ========================================
    const lastRow = sheet.lastRow?.number || dataStartRow;

    for (let i = dataStartRow; i <= lastRow; i++) {
      const row = sheet.getRow(i);

      row.eachCell({ includeEmpty: false }, cell => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }





    // ========================================
    // 6. EXPORTAR
    // ========================================
    workbook.xlsx.writeBuffer()
      .then(buffer => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        fs.saveAs(blob, `${filename}.xlsx`);
      })
      .catch(err => {
        console.error('Error Excel:', err);
      });
  }
}
