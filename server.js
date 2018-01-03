var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');

var url = 'http://www.dytt8.net/html/gndy/dyzz/list_23_';
var index = 1;
var infos = [];
let links = []
function getThunderLink(url) {
    url = 'http://www.dytt8.net/' + url
    http.get(url, function(res) {
        var chunks = []
        res.on('data', function(chunk) {
            chunks.push(chunk)
        })
        res.on('end', function() {
            var html = iconv.decode(Buffer.concat(chunks),'gb2312')
            var $ = cheerio.load(html, {decodeEntitles: false})
            // console.log($('#Zoom td>a'))
            // console.log(links)
        })
    })
}
function getLinks() {
    console.log(infos)
    if (infos.length) {
        for(var item of infos) {
            getThunderLink(item.url)
        }
    }
}
function getInfo(url, i) {
    console.log('开始获取第'+ i + '个')
    http.get(url + i +'.html', function(res) {
        var chunks = []
        res.on('data', function(chunk) {
            chunks.push(chunk)
        })
        res.on('end', function() {
            var html = iconv.decode(Buffer.concat(chunks),'gb2312')
            var $ = cheerio.load(html, {decodeEntitles: false})
            $('.co_content8 .ulink').each(function(index, item) {
                infos.push({
                    title: $(item).text(),
                    url: $(item).attr('href')
                })
            })
            if (i < 3) {
                getInfo(url, ++index)
            } else {
                // console.log(infos)
                console.log('内容获取完毕')
                getLinks()
            }
        })
    })
}
function main() {
    console.log('开始爬取');
    getInfo(url, index)
}
main();
