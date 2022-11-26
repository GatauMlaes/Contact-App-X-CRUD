const { loadContact, findContact ,addContact ,cekDuplikatNama , cekDuplikatEmail, deleteContact, updateContact } = require("./utils/contacts.js");
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const morgan = require("morgan");
const { urlencoded } = require("express");
const {body,validationResult, check} = require('express-validator')
const session = require('express-session');
const cookieParser = require("cookie-parser");
const flash = require('connect-flash')

const app = express();
const port = 3200;

//middleware
app.set("view engine", "ejs");

app.use(morgan("dev"));


app.use(express.static("public"));
app.use(urlencoded({extended:true}))

app.use(cookieParser('secret'))
app.use(
  session({
  cookie:{maxAge:6000},
  secret:'secret',
  resave:true,
  saveUninitialized:true
}))

app.use(flash())

app.use(expressLayout);

app.get("/home", (req, res) => {
  res.render("index", { title: "HOME PAGE ", layout: "layouts/main" });
});


app.get("/about", (req, res) => {
  res.render("about", { title: "About", layout: "layouts/main" });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  const kontak = contacts.users;
  res.render("contact", {
    title: "Contact",
    layout: "layouts/main",
    kontak,
    msg:req.flash('msg')
  });
});

app.post('/contact' , [
  body('nama').custom((value) => {
    const duplikatNama = cekDuplikatNama(value)
    if(duplikatNama){
      throw new Error('Maaf Nama Sudah Ada Di Daftar Kontak')
    }
    return true ;
  }), body('email').custom((value) => {
    const duplikatEmail = cekDuplikatEmail(value)
    if(duplikatEmail){
      throw new Error('Maaf Email Sudah Ada Di Daftar Kontak')
    }
    return true ;
  }),
  check('email' , ' Email Tidak Valid').isEmail(),
  check('noTelp' , ' Nomor HP Tidak Valid ').isMobilePhone('id-ID'),
  check('noTelp' , ' Nomor HP Tidak Valid (Minimal 11 Digit) ').isLength({min:11})
],(req,res) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    res.render('add-contact' , {title: "Add-Contact",layout:"layouts/main",errors:error.array()})
    
  } else {
  
  addContact(req.body)
  //kirim msg
  req.flash('msg' , 'Data Contact Berhasil Di Tambahkan')
  res.redirect('/contact')
  }

  
 
})

app.get('/contact/add' , (req,res)=>{
  res.render('add-contact' , {title: "Add-Contact",layout:"layouts/main"})
})


app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  const nama = req.params.nama;
  if(!contact){
    res.status(404)
    res.render('error', {title: "404",layout:"layouts/error"})
  } else{
    deleteContact(nama)
    req.flash('msg' , 'Data Contact Berhasil Di Hapus')
    res.redirect('/contact')
  }

});

//Edit

app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('edit-contact' , {
    title: "edit-Contact"
  ,layout:"layouts/main",
  contact
})

});


app.post('/contact/update' , [
  body('nama').custom((value,{req}) => {
    const duplikatNama = cekDuplikatNama(value)
    if(value !== req.body.oldName && duplikatNama){
      throw new Error('Maaf Nama Sudah Ada Di Daftar Kontak')
    } else {
      return true ;
    }
   
  }),
  check('email' , ' Email Tidak Valid').isEmail(),
  check('noTelp' , ' Nomor HP Tidak Valid ').isMobilePhone('id-ID'),
  check('noTelp' , ' Nomor HP Tidak Valid (Minimal 11 Digit) ').isLength({min:11})
],(req,res) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    res.render('edit-contact' , {title: "Edit-Contact",layout:"layouts/main",errors:error.array(),contact:req.body })
    
  } else {
    updateContact(req.body)
    res.redirect('/contact')
  }

  
 
})




app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  const nama = req.params.nama;
  res.render("details", {
    title: "Detail",
    layout: "layouts/main",
    contact,
    nama,
  });
});

app.get("/", (req, res) => {
  res.sendFile("./coba.html", { root: __dirname });
});

app.use((req, res) => {
  res.status(404);
  res.sendFile("error.html", { root: __dirname });
});
app.use("/", (req, res) => {
  res.status(404);
  res.sendFile("error.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`Listening in Port ${port}`);
});
