"use client";

import React from "react";

export default function Test() {
  const [data, setData] = React.useState<unknown>(null);
  React.useEffect(() => {
    (async function () {
      const res = await fetch("http://localhost:3030/token", {
        method: "POST",
        body: '{"username": "user1", "password": "pass1"}',
        headers: { "Content-Type": "application/json" },
      });

      setData(await res.json());
    })();
  }, []);
  return <code>{JSON.stringify(data, null, 2)}</code>;
}