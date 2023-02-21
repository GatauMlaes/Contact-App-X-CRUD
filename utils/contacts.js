const fs = require("fs");



const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync("data");
}

const dataPath = "./data/contact.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '{"users":[] }', "utf-8");
}

const loadContact = () => {
    const file = fs.readFileSync("./data/contact.json", "utf-8");
    const kontak = JSON.parse(file);
    return kontak;
  };


const findContact = (nama) => {
    const contacts = loadContact();
    const cariNama = contacts.users.find(
      (kontak) => kontak.nama.toLowerCase() === nama.toLowerCase()
    );
    return cariNama
}

// Menuliskan Atau Menimpa File Json bary


const saveContacts = (contacts) => {
  fs.writeFileSync("./data/contact.json", JSON.stringify(contacts, null, 2));
}

// const saveContacts = (contacts) => {
//   fs.writeFileSync("data/contact.json" ,  JSON.stringify(contacts, null, 2))
// }


//Untuk Menambah Kontak
const addContact = (contact) => {
  const contacts = loadContact()
  contacts.users.push(contact)
  saveContacts(contacts)
}

// cekDuplikat 

const cekDuplikatNama = (nama) => {
  const contacts = loadContact()
  return contacts.users.find((contact) => contact.nama === nama)
  
}
const cekDuplikatEmail = (email) => {
  const contacts = loadContact()
  return contacts.users.find((contact) => contact.email === email)
  
}

const deleteContact = (nama) => {
  const contacts = loadContact()
  const filterContacts = contacts.users.filter((contact) => contact.nama !== nama)
  const filtered = JSON.stringify(filterContacts,null,2)
  fs.writeFileSync("./data/contact.json", `{"users":${filtered} }`);
  
}

const updateContact = (contactBaru) => {
  const contacts = loadContact()
  const filterContacts = contacts.users.filter((contact) => contact.nama !== contactBaru.oldName)
  console.log(filterContacts , contactBaru);
  delete contactBaru.oldName;
  filterContacts.push(contactBaru)
  const filtered = JSON.stringify(filterContacts,null,2)
  fs.writeFileSync("./data/contact.json", `{"users":${filtered} }`);
}



module.exports={loadContact ,findContact , addContact , cekDuplikatNama , cekDuplikatEmail , deleteContact , updateContact}
