"use client"

import { useState } from "react"
import { columns } from "@/components/table/columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/table"
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

const fetcher = (url: any) => fetch(url).then(r => r.json())

async function sendRequest(url: string, { arg }: { arg: { Title: string, Body: string }}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(arg)
  })
}

export default function Home() {
  const [newTodo, setNewTodo] = useState<{title: string, body: string}>({ title: "", body: ""})

  const { data, error, isLoading } = useSWR('http://localhost:4000/api/todos', fetcher, { refreshInterval: 1000 })
  const { trigger, isMutating } = useSWRMutation('http://localhost:4000/api/todo', sendRequest)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>Loading</div>

  return (
    <main className="h-screen w-screen grid place-items-center bg-gray-200">
      <div className="flex flex-col items-center px-12 py-24 rounded-xl bg-slate-700/10">
        <Input 
          type="text" 
          placeholder="Title"
          className="w-[300px]"
          value={newTodo.title}
          onChange={(e) => setNewTodo({
            ...newTodo,
            title: e.target.value
          })}      
        />
        <Input 
          type="text" 
          placeholder="Body"
          className="w-[300px] my-4"
          value={newTodo.body}
          onChange={(e) => setNewTodo({
            ...newTodo,
            body: e.target.value
          })}      
        />
        <Button
          className="mb-12"
          disabled={isMutating}
          onClick={async () => {
            try {
              const result = await trigger({
                Title: newTodo.title,
                Body: newTodo.body
              })
              console.log("res" + result);

              setNewTodo({
                title: "",
                body: ""
              })
            } catch (e) {
              console.log(e);
              alert(e)
            }
          }}
        >
          {isMutating ? 'Loading' : 'Add Todo'}
        </Button>

        <DataTable columns={columns} data={data}  />
      </div>
    </main>
  )
}
