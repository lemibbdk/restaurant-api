# Projekat iz predmeta Praktikum - Sistemi e-poslovanja

## Zahtevi aplikacije

Aplikacija treba da omogući registrovanim korisnicima veb sajta sa ulogom administratora da dodaju, menjaju i brišu stavke iz jelovnika razvrstanog po kategorijama. Administratori mogu da uređuju i spisak kategorija. Svaka stavka menija je ilustrovana sa jednom ili više fotografija, a opisana je nazivom, kratkim testom sa navedenim sastojcima, izdvojenim podatkom o masi i energetskoj vrednosti porcije (za tri različite veličine), kao i o ceni za tri različite ponuđene veličine porcije (mala, velika, ekstra velika porcija). Stavka menija ne mora da ima cene za sve tri navedene veličine porcija. Posetioci sajta koji žele da naprave porudžbinu moraju da se registruju. Prilikom registracije unose svoje korisničko ime, željenu lozinku. Korisnik može da doda jednu ili više poštanskih adresa sa brojem telefona na koje može da zahteva isporuku budućih porudžbina. Prilikom kreiranja porudžbine, korisnik bira stavke iz menija, veličinu porcije i broj takvih porcija određene stavke koju dodaje u korpu. Uz konačnu porudžbinu može da doda i posebnu napomenu koja se odnosi na celu porudžbinu. Korisnik može da definiše željeno vreme dostave. Vreme dostave ne može da bude skorije od 45 minuta od trenutka kreiranja narudžbine i ne može da bude dalje od kraja radnog dana kojeg se kreira porudžbina. Administratori portala treba da imaju uvid u izvršene porudžbine i mogu da ih obeleže kao prihvaćene. Dok porudžbina nije prihvaćena, korisnik koji je napravio porudžbinu može da je otkaže ili promeni. Ako je porudžbina prihvaćena, ne može da bude otkazana ili izmenjena. Administrator može da obeleži porudžbinu kao izvršenu na kraju radnog dana, a tek onda korisnik koji je napravio porudžbinu može da je oceni ocenom od 1 do 5. Uz ocenu može da napiše i kratku napomenu. U istoriji porudžbina korisnika se vide sve porudžbine koje su ikada bile napravljene, tako da i administrator, ali i korisnik mogu da imaju uvid u porudžbine. Grafički interfejs treba da bude realizovan sa responsive dizajnom.

## Dokumentacija back-end dela projekta

Model baze (ilustracija i medjusobne veze) se mogu videti na /resources/Database-model.png
Administrator i user tabele predstavljaju jake entitete.
User može imati jednu ili više adresa, tako da postoji i zasebna tabela postal_address, koja ima spoljni ključ ka user tabeli.
User ima aktivnu korpu (tabela cart), koja je aktivna sve dok ne napravi porudzbinu (tabela order) za tu korpu.
Pošto korpa može da ima više artikala, kojih opet može biti količinski više, stavka korpe (tabela cart_item) čuva u sebi cart_id(spoljni ključ), veličinu artikla(tabela item_info, takođe spoljni ključ) kao i količinu željene veličine artikla.
Tabela item_info sadrži podatke o veličini (kojih može biti po tačno 3 za svaki artikal), masi, energ. vrednosti i ceni za datu veličinu, i ma spoljni ključ ka tabeli item, koja sadži informacije koje su zajedničke za sve veličine (kategorija, ime i sastojci)
Artikal (tabela item) može imati više slika (koje su naravno iste za sve veličine), tako da tabela photo ima spoljni ključ ka tabeli item.
Ime artikla mora biti jedinstveno (unique), i artikal pripada ordeđenoj kategoriji, te ima spolji ključ ka kategoriji (tabela category).
Kategorija može imati i nadkategoriju (parent kategoriju) te ako je ima, čuva spoljni ključ ka samoj sebi, ako nema nadkategoriju onda je NULL. Ime kategorije mora biti takodje unikatno.
Porudžbina (tabela order) kao spoljne ključeve ima tebele cart, i postal_address, jer korisnik može označiti neku od mogućih više adresa koje napravio(uneo).
Porudžbinu korisnik može oceniti, tako da tabela evaluation ima spoljne ključeve ka tabelama order i user.
Tabela administrator nema nikakvih relacija ka ostalim tabelama.


U korpi (tabela cart) se čuvaju podaci o veličinama (tabela item_info) određenih artikala (tabela item - koja se ne čuva u korpi).
Svaki artikal (tabela item) ima svoje 3 veličine (tebela item_info). Tabela item_info, dakle, postoji kako bi u korpi čuvali koja je veličina artikla u pitanju.


## Uputstvo:

1. Podici vec delimicno popunjenu bazu podataka iz SQL datoteke /resources/restaurant.sql ili praznu /resources/restauratn-empty.sql
2. Napraviti key store folder/fajlove
3. napraviti static folder i po zelji prebaciti slike koje su povezane sa delimicno popunjenom bazom /resources/static -> /static
4. Importovati postman upite za testiranje API-ja /resources/Restaurant app.postman_collection.json

## Pristupni parametri rola korisnika
1. username: aleksa, password: asdasdasd          (admin)
2. email: aleksa2@test.com, password: asdasdasd   (user)
# Link ka repozitorijumu front-end dela
https://github.com/lemibbdk/restaurant-react
