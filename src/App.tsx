import { useState, useEffect } from "react";
import "./App.css";
import Posts, { Post } from "./components/posts/Posts";
import Search from "./components/search/Search";

function App() {
  const [title, setTitle] = useState<string>("");
  const [filter, setFilter] = useState<Post[]>([]);

  useEffect(() => {
    if (!title) {
      return;
    }

    const fetchSearchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts?title_like=${title}`);
        const data = await response.json();
        setFilter(data)
      } catch (err) {
        console.error('Ошибка');
      }
    };

    fetchSearchPosts();
  }, [title]);

  return (
    <div className="App">
      <Search setTitle={setTitle} />
      <Posts title={title} setFilter={setFilter} filter={filter} />
    </div>
  );
}

export default App;
