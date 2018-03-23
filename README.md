# textedit
textedit node 文本 插入行  插入文本 模板  模板插入

/**
 * 
 * @param {String} inpath 输入文件路径 encode:utf-8
 * @param {String} outpath 可选输出文件路径(若为空则覆盖)
 * @param {Array} data flag : text文件中写入 to-insert<flag>作为标记,type : line表示下一行添加，replace表示替换原位
 * exp:[{flag:'',text:'',type:'line|replace'},{flag:'',text:'',type:'line|replace'}] 
 */