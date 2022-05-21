import React from 'react';
import logo from './logo.svg';
import './App.css';
import { DragDropContext } from "react-beautiful-dnd";
import { reorder, reorderRows } from './reorder';
import { AuthorList } from './AuthorList';
import {generate} from 'shortid'
import images from "./images.json"

const aId = generate()
const unrankedId = generate()

const App = () => {
  const [rows, setRows] = React.useState([
    { id: aId, label: "a", urls: [] },
    {
      id: unrankedId,
      label: "unranked",
      urls:images,
    },
  ]);

  React.useEffect(() => {
    const data = localStorage.getItem('my-tier-list')
    if (data) {
      setRows(JSON.parse(data))
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('my-tier-list', JSON.stringify(rows))
  })

  return (
    <DragDropContext
      onDragEnd={({destination, source }) => {
        // // dropped outside the list
        if (!destination) {
          return;
        }

        setRows(reorderRows(rows, source, destination));
      }}
    >
      <div>
        <button onClick={() => {
          setRows([
            {
              id: generate(),
              label: '',
              urls:[]
            },
            ...rows
          ])
        }}>add row</button>
        {rows.map((row, i) => (
          <AuthorList
            onUp={() => setRows(reorder(rows, i, i-1))}
            onDown={() => setRows(reorder(rows, i, i+1))}
            onLabelChange={(newText: string) => setRows(
              rows.map(x => {
                if (x.id === row.id) {
                  return {
                    id: x.id,
                    label: newText,
                    urls: x.urls
                  }
                }
                return x
              })
            )}
            internalScroll
            key={row.id}
            listId={row.id}
            listType="CARD"
            row={row}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;
