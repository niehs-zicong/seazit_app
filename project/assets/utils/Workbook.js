import XLSX from 'xlsx';
import { saveAs } from 'filesaver.js';

let type = (function() {
        var classToType = {};
        'Boolean Number String Function Array Date RegExp Undefined Null'
            .split(' ')
            .forEach(function(d) {
                classToType['[object ' + d + ']'] = d.toLowerCase();
            });
        return function(jsonData) {
            var strType = Object.prototype.toString.call(jsonData);
            return classToType[strType] || 'object';
        };
    })(),
    excel_datenum = function(v, date1904) {
        var epoch;
        if (date1904) v += 1462;
        epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    },
    sheet_from_array_of_arrays = function(data) {
        var cell,
            cell_ref,
            i,
            j,
            ws = {},
            range = {
                s: { c: 10000000, r: 10000000 },
                e: { c: 0, r: 0 },
            };
        for (i = 0; i < data.length; i++) {
            for (j = 0; j < data[i].length; j++) {
                if (range.s.r > i) range.s.r = i;
                if (range.s.c > j) range.s.c = j;
                if (range.e.r < i) range.e.r = i;
                if (range.e.c < j) range.e.c = j;
                cell = { v: data[i][j] };
                if (cell.v === null) continue;
                cell_ref = XLSX.utils.encode_cell({ c: j, r: i });
                switch (type(cell.v)) {
                    case 'number':
                        cell.t = 'n';
                        break;
                    case 'boolean':
                        cell.t = 'b';
                        break;
                    case 'date':
                        cell.t = 'n';
                        cell.z = XLSX.SSF._table[14];
                        cell.v = excel_datenum(cell.v);
                        break;
                    default:
                        cell.t = 's';
                }
                ws[cell_ref] = cell;
            }
        }
        if (range.s.c < 10000000) {
            ws['!ref'] = XLSX.utils.encode_range(range);
        }
        return ws;
    };

class Workbook {
    constructor() {
        this.SheetNames = [];
        this.Sheets = {};
    }

    addWorksheet(name, data) {
        this.SheetNames.push(name);
        this.Sheets[name] = sheet_from_array_of_arrays(data);
    }

    download(fn) {
        let wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' };

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length),
                view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) {
                view[i] = s.charCodeAt(i) & 0xff;
            }
            return buf;
        }

        saveAs(new Blob([s2ab(XLSX.write(this, wopts))], { type: '' }), fn);
    }
}

export default Workbook;
