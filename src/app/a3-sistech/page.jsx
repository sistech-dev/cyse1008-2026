
"use client";
import Button from "@mui/material/Button";

import Link from "@mui/material/Link";
import { RouterLink } from "src/routes/components";
export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Assignment 3: My New Page</h1>

      <p>
        <strong>URL:</strong> /a3-sistech
      </p>

      <p>
        <strong>File:</strong> src/app/a3-sistech/page.jsx
      </p>
       <Button variant="contained" color="primary">
        Click Me
      </Button>

      <Link component={RouterLink} href="/">
        Back to Home
        
      </Link>
      
    </main>
    
  );
}