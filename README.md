# Address Book  

A simple address book using [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-5.0&tabs=visual-studio-code) and [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/) for the backend, and [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/) and [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/) for the frontend.  

## Setup  
After cloning the repository, run the `npm install` command in the `ClientApp` folder. The project can then be launched through your preferred IDE.  

## Repository Description  
This is a simple address book implementation. Users can:  
- Add new contacts (people)  
- Edit and delete existing contacts  
- Assign multiple email addresses and phone numbers to each contact  
- Categorize emails/phone numbers (e.g., **Home**, **Work**). Missing categories can be added as needed  
- No security, user authentication, or similar features are implemented  

The homepage displays contacts grouped by the first letter of their names. Clicking a contact opens a "side panel" showing detailed information. This functionality uses routing:  
- Navigating to `/` shows the contact list  
- Navigating to `/1` displays the contact list with a side panel showing details for contact ID 1  

## Useful Links  
- [EF Core - Defining and Configuring a Model](https://docs.microsoft.com/en-us/ef/core/modeling/)  
- [EF Core - Loading Data](https://docs.microsoft.com/en-us/ef/core/querying/)  
- [EF Core - Loading Related Data](https://docs.microsoft.com/en-us/ef/core/querying/related-data/eager)  
- [EF Core - Saving Data](https://docs.microsoft.com/en-us/ef/core/saving/basic)  
- [EF Core - Saving Related Data](https://docs.microsoft.com/en-us/ef/core/saving/related-data)  
- [EF Core - Deleting Data](https://docs.microsoft.com/en-us/ef/core/saving/cascade-delete)  
- [Fluent UI Grouped List](https://developer.microsoft.com/en-us/fluentui#/controls/web/groupedlist)  
- [Fluent UI Panel](https://developer.microsoft.com/en-us/fluentui#/controls/web/panel)  
- [React Router](https://reactrouter.com/web/guides/quick-start)  

## Important Notes  
- Frontend API calls are directed to `https://localhost:7037`  
- All API endpoint paths are defined in the `context` variable within `ClientApp/src/setupProxy.js`

Citations:
[1] https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-5.0&tabs=visual-studio-code
[2] https://docs.microsoft.com/en-us
