1)What URL does this file correspond to?
Answer:-It corresponds to:/a3-sistech
In the Next.js App Router:
src/app/a3-sistech/page.jsx   →   /a3-sistech
src/app/a3-sistech/layout.jsx →   wraps /a3-sistech
So anything inside the a3-sistech folder maps to:
http://localhost:3000/a3-sistech
2)What role does this file play?
Wraps the page
Receives { children }
Adds shared UI (padding, header, border, navbar, etc.)
Affects all routes inside that folder
Example flow:
layout.jsx
   ↓
page.jsx