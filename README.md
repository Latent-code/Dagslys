<p align="center">
  <a href="https://www.dagslys.no/en/">
    <img alt="Dagslys" src="https://www.dagslys.no/wp-content/uploads/2019/02/dagslys-logo2.png" width="400" />
  </a>
</p>
<h1 align="center">
  Dagslys rental portal
</h1>

## 🚀 Quick start

1.  **Clone this monorepo**

  Cope example to .env file

    ```shell
    git clone https://github.com/Latent-code/Dagslys.git
    cd dagslys
    ```


2.  **Install dependencies**

    ```shell
    npm install
    ```

2.  **Populate the .env file.**
    Copy example to .env file

    ```shell
    # 
    cp .env.example .env
    ```


3.  **Run Vercel develop / gatsby develop**
    Navigate into your new site’s directory and start it up.

    ```shell
    cd Dagslys
    npm run develop
    ```


    Your site is now running at http://localhost:3000 or http://localhost:8000


## User Guide:


### For å legge til nye hovedmenyer må man gjøre følgende:
* Lag en ny mappe i rentman, OBS! mappene MÅ ha noe i seg, hvis ikke blir de filtrert ut.

* Menyen sorteres basert på rekkefølgen i Rentman

### Algolia Search:
* Index blir laget og gått gjennom under Gatsby Build prosessen. Mer info om hva som blir sendt dit finner man under utils/algolia-queries


## TODO´s
### Haster:
- [ ] La brukere skrive inn mengden ting de ønsker å Booke...!!!!!!


- [ ] Implementere Adobe React-spectrum
        - [x] App Provider i SSR og Browser på plass
        - [x] Import på plass
        - [ ] Endre alt fra MUI til React-Spectrum

- [ ] Fikse design på kategorier i "page.js" ser ikke helt topp ut...
        - [ ] Skille mellom knappene, lenger linje?

### Todo:

- [ ] Gjøre parent i menyen bold, så man vet hvor man er?

- [ ] endre åpnelogo på mobil, så den står høyere. for øyeblikket er den lav.


- [ ] Lage kits, kran, gimbal, lyd, gopro kit, fx6, påsyn (minotor, decimator ++), dagslys? Pixel?

- [ ] DZO linser
- [ ] Legge inn Motion Air ting:
        - [ ] G1
        - [ ] Movi
        - [ ] Black Arm
        - [ ] +++

- [ ] Biler ?

### LOGIN:
- [ ] Cart funksjon på vei, må tenke på en global måte å løse uteende på. Tenk på det
- [ ] Lag en komponent med "Legg til i kurv" og "anntall i kurv" som mottar enheten og finner ut hvor mange det finnes i kurven.


### API:
- [ ] Lage nytt opplegg med API fra Rentman. 
        - [x] koble til API og lage pages derfra
        - [x] Få inn bildene som GatsbyImageSharp i graphiql: https://mcro.tech/blog/gatsby-image-sharp/#:~:text=For%20generating%20ImageSharp%20from%20URL,and%20create%20a%20new%20ImageSharp.
        - [X] Timecode | Sync åpner seg ikke, aner ikke hvorfor. DET ER FORDI NAVNET INNEHOLDER | mellom.
        - [x] Gatsby-Node - Lage pages av alle folders, slik at vi kan få oversikt over f.eks kameraer, lyd, osv. Lage en side for hver kategori, Media, Support, Grip, Microphones osv.
        - [X] Fikse lenker, slik at Super Clamps havner på rental/lighting/grip/superclamps.
        - [X] Fikse Breadcrumbs, bruke location.pathname og lage linker derfra basert på et array.
        - [ ] Fikse searchBar med bilder osv. etter nye endringer. 
        - [ ] Se over hvor ting kommer fra. Nå bør alt komme fra graphiql
        - [ ] Lagre scrollpossisjon når man navigerer.
        - [ ] Gå over hva som skal ligge ute og ikke.
        - [ ] Nå kan man egentlig hente ut children fra graphiQL, så kan endre en del i menyen osv. ligger under childRentalItems i graphiql 
        - [ ] Sjekke opp Vercel SWR : https://swr.vercel.app/
        - [ ] Lage nytt opplegg med API fra Rentman. 

- [ ] React children? https://www.smashingmagazine.com/2021/08/react-children-iteration-methods/


### DONE:

- [X] Legge inn Snackbar som sier success/failed osv. 
- [X] Aktiv 100 stativ dukker ikke opp!????
- [x] Lage en handlekurv på sikt? https://useshoppingcart.com/ / https://www.gatsbyjs.com/tutorial/ecommerce-tutorial/ 
- [X] Bilder som må fikses:
        - [X] Gorpo
        - [X] Oconnor
        - [X] Sony kortleser
        - [X] MKH416 mic
        - [X] Wisycom LNBA Kit
- [x] når man kommer fra hjemmsiden, trykker på rental, så går tilbake funker ikke hjemmesiden.
- [x] Alle queries kan gjøres fra 1. Vi finner nå bilder og content fra samme. Sjekk ut Query i rental.js.
- [x] Noe feil med sub-meny URI i drawer.js. Sjekk det ut.
- [x] La inn en isLoading i drawer.js som venter med å laste ting før siden er klar.
        - [X] Style isLoading funksjonen
- [X] Fikse searchBar da noen funksjoner bruker dev_brent som variabel, noe som ikke funker på prod.
- [X] Stativene dukker ikke opp i All equipment på hovedsiden. samme problem som sist vil jeg tro
- [X] Media returns 404 error.
- [x] Camera hovedmeny viser lydting, og en tittel som er cameras 2,  noe som er feil her.
- [x] legge inn footer på rental siden. "alt ligger ikke inne osv. epost, telefon og sånt. Terms of Conditions bør også ligge på nettet.
- [x] Hvis man trykker på en item i rental siden, må menyen utvide seg til riktig sted. 
- [x] Legge inn breadcrumb
- [X] Menyen går bare 3 steg ned. Sjekk opp hva som skjer med Kamera -> Support -> Stativer
- [x] Tenk på menyer, det kommer nok et nivå til, og dette bør automatiseres på et vis..
- [x] Automatisk sjekke at sub-menyer som ikke er lagt til i menyen i wordpress ikke dukker på på nettsiden heller. Nå ligger f.eks sub2 under kamera, selv om den ikke er lagt til i menyen.
- [x] Repopulere søkestikkord med ny content
- [x] Fokusere pekeren i søkefeltet etter man trykker søk 
- [x] DrawerItem   console.log(element) Element har ikke childItems på live site, ANER IKKE HVORFOR! Feilen er i layout.js
- [x] Fikse query på "page.js" til "posts" til flere små queries, pr. nå har vi 94 posts, dette kommer til å krasje når vi runder 100....
- [x] Fikse query på "rental.js" page slik at den deler opp postene i deler, så man ikke når max 100 posts.
- [x] Sette opp slik at 404 error ikke har sidebar fra rental siden...
- [x] Fikse slik at /rental/ er sortert etter type ( Cameras: alle kameraer. Suppoert: Alt support. Wireless: alt wireless. )
- [x] Etter bruker har scrollet langt nok ned, forsvinner "intro" logoen, slik at man ikke kommer opp igjen.
- [x] Når man trykker på logoen under /rental/ fucker man hjemmesiden
- [x] Gjør search komponenten mobilvennlig.
- [X] Noe feil med menyene hvis man legger til en ny side. Den dukker ikke påå. Det er snakk om linje 67++ 