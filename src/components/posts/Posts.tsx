import { FC, useState, useEffect } from "react";

export interface Post {
  id: number;
  title: string;
  body: string;
  favorites: boolean;
}

interface PostProps {
  setFilter: React.Dispatch<React.SetStateAction<Post[]>>;
  title: string;
  filter: Post[];
}

interface StateItem {
  error: null | string;
  items: Post[];
}

const Posts: FC<PostProps> = ({ title, filter, setFilter }) => {
  const [state, setState] = useState<StateItem>({
    error: null,
    items: [],
  });

  useEffect(() => {
    if (title) {
      return;
    }

    const fetchPostList = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts");
        const postList = await response.json();
        setState((prevState) => ({ ...prevState, items: postList }))
      } catch (err: unknown) {
        console.error('Error');
        setState((prevState) => ({ ...prevState, error: err?.toString() || 'Ошибка' }))
      }
    }

    fetchPostList();
  }, [title]);

  if(state.error) {
    return <p>Error</p>;
  }

  const favoritesPostFilter = (item: Post, callback: (data: Post) => void) => {
    const updateData: Post = {
      id: item.id,
      title: item.title,
      body: item.body,
      favorites: !item.favorites,
    };

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    };

    fetch(`http://localhost:3000/posts/${item.id}/`, requestOptions)
      .then((response) => response.json())
      .then(() => callback(updateData));
  };

  const isFiltered = title.length > 0;

  const onFavoriteClick = (item: Post) => () => {
    if (isFiltered) {
      favoritesPostFilter(item, (data) => {
        setFilter((prevList) => prevList.map((item) => {
          if (item.id === data.id) {
            return { ...item, ...data }
          }

          return item;
        }));
      });

      return;
    }

    favoritesPostFilter(item, (data) => {
      setState((prevState) => ({
          ...prevState,
          items: prevState.items.map((item) => {
            if (item.id === data.id) {
              return { ...item, ...data }
            }
  
            return item;
          }),
      }))
    });
  };

  const viewPosts = isFiltered ? filter : state.items;

  return (
    <ul className="posts__list">
      {viewPosts.map((item) => {
        const post__classes = item.favorites ? "favorites__red" : "favorites__grey";
        return (
          <li className="post__item" key={item.id}>
            <div className="post__inner">
              <div className="post__title">{item.title}</div>
              <div className="post__text">{item.body}</div>
            </div>
            <div onClick={onFavoriteClick(item)}>
              <img
                className={post__classes}
                src="images/like-3.svg"
                alt="favorites"
              />
            </div>
          </li>
        )
      })}
    </ul>
  );
};

export default Posts;
