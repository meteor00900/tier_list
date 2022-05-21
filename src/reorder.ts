import { DraggableLocation } from "react-beautiful-dnd";
import { Row } from "./types";

export const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1) // 入力されたlistの中から、startIndexに該当する要素を削除する
    result.splice(endIndex, 0, removed) // endIndex, 0は何も消さない。で、endIndexは最後の要素なので、一番うしろに消したのを追加する

    return result
}


export const reorderRows = (
    rows: Row[],
    source: DraggableLocation,
    destination: DraggableLocation
) => {
    const current = rows.find(x => x.id === source.droppableId)!
    const next = rows.find(x=> x.id === destination.droppableId)!
    const target = current.urls[source.index]

    if (source.droppableId === destination.droppableId) {
        const reordered = reorder(
          current.urls,
          source.index,
          destination.index
        );
        return rows.map(x => (x.id === current.id ? {...x, urls:reordered} : x));
    }

    // 移動元からドラッグされたものを消す
    current.urls.splice(source.index, 1);
    // 移動先の場所に入れる
    next.urls.splice(destination.index, 0, target)
    
    // return rows
    //   .map((x) => (x.id === current.id ? { ...x, urls: current.urls } : x))
    //   .map((x) => (x.id === next.id ? { ...x, urls: next.urls } : x));
    return rows.map(x => {
        if (x.id === current.id) {
          return {
            ...x,
            urls: current.urls,
          };
        } else if (x.id === next.id) {
          return {
            ...x,
            urls: next.urls,
          };
        }
        return x
    })
}