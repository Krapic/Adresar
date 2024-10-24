# Adresar

Jednostavni adresar koristeći [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-5.0&tabs=visual-studio-code) i [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/) na backendu i [React](https://reactjs.org/) s [TypeScript](https://www.typescriptlang.org/)-om i [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/) na frontendu.  

## Setup

Nakon što se repozitorij klonira, potrebno je pokrenuti naredbu `npm install` u folderu `ClientApp`. Nakon toga se projekt može pokrenuti kroz odgovarajući IDE.

## Opis repozitorija

Napravljen je jednostavan adresar. Korisnik može dodati novi kontakt (osobu), urediti i obrisati postojeći. Svakom kontaktu je se može dodijeliti ime i prezime, više email adresa i više telefonskih brojeva. Svakoj email adresi i svakom telefonskom broju može se dodijeliti kategorija (npr. **Home**, **Work**, itd.). Ako nema željene kategorije, po potrebi moguće ju je i dodati. U aplikaciji nije  implementiran nikakav security, korisnik ili tome slično.

Na početnoj stranici se prikazuje lista kontakata grupiranih po prvom slovu imena. Kada korisnik klikne na kontakta, njegovi detalji se  prikazuju na "side-panelu". Ta funkcionalnost je implementirana pomoću ruta. Dakle, kada korisnik navigira na `/`, vidi listu kontakata, a kada navigira na `/1`, vidi listu kontakata preko koje je "side-panel" gdje se vide detalji kontakta s ID-em 1.

## Korisni linkovi

- [EF Core - Defining and Configuring a Model](https://docs.microsoft.com/en-us/ef/core/modeling/)
- [EF Core - Loading Data](https://docs.microsoft.com/en-us/ef/core/querying/)
- [EF Core - Loading Related Data](https://docs.microsoft.com/en-us/ef/core/querying/related-data/eager)
- [EF Core - Saving Data](https://docs.microsoft.com/en-us/ef/core/saving/basic)
- [EF Core - Saving Related Data](https://docs.microsoft.com/en-us/ef/core/saving/related-data)
- [EF Core - Deleting Data](https://docs.microsoft.com/en-us/ef/core/saving/cascade-delete)
- [Fluent UI Grouped List](https://developer.microsoft.com/en-us/fluentui#/controls/web/groupedlist)
- [Fluent UI Panel](https://developer.microsoft.com/en-us/fluentui#/controls/web/panel)
- [React Router](https://reactrouter.com/web/guides/quick-start)

## Bitne napomene

- U frontend dijelu projekta pozivi web servisa se upućuju na `https://localhost:7037` URL.
- Sve putanje do API endpointova dodane su u `ClientApp/src/setupProxy.js` datoteku u varijablu `context`.
