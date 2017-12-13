var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'liang@corp.islandpacificmarket.com',
  password: '5128238',
  host: 'imap.secureserver.net',
  port: 993,
  tls: true
});

var fs=require("fs");

const simpleParser = require('mailparser').simpleParser;

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {

  	//console.log("box:",box);

    if (err) throw err;
    var f = imap.seq.fetch(box.messages.total, {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)',"TEXT"],
      struct: true
    });

    f.on('message', function(msg, seqno) {
      //console.log('Message #', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';


        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
          

          	simpleParser(buffer, (err, mail)=>{
  
				//console.log("mail seqno#",seqno);
          		//console.log("info.witch:",info.which);
          		if(mail.subject) console.log("subject:",mail.subject);
          		if(mail.text){
          			//console.log("text",mail.text);
          			mail.text.indexOf("Body message")>=0?console.log("found text"):console.log("not found");
          		}
/*		        fs.appendFile('index.html', JSON.stringify(mail), function (err) {
		          if (err) throw err;
		          console.log('Saved!');
		        }); */
          	});

          //console.log(buffer);
          //console.log("info",info);
        });
        stream.once('end', function() {
          //console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function(attrs) {
        //console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        //console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      //console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      //console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  //console.log('Connection ended');
});

imap.connect();