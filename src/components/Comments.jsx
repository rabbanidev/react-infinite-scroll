import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const Comments = () => {
  const loaderRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?_start=${
          page * 10
        }&_limit=10`
      );

      const jsonData = await res.json();

      if (jsonData.length === 0) {
        setHasMore(false);
      } else {
        setComments((prevComments) => [...prevComments, ...jsonData]);
        setPage((prevPage) => prevPage + 1);
      }
    };

    const onInterSection = (items) => {
      const loaderItem = items[0];
      if (loaderItem.isIntersecting && hasMore) {
        // Fetch comments
        fetchProducts();
      }
    };

    // create observer
    const observer = new IntersectionObserver(onInterSection);

    if (observer && loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // cleanup
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [hasMore, page]);

  return (
    <div>
      <h2>Fetching Comments</h2>

      {/* Render  */}

      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.id}. {comment.name}
          </li>
        ))}
      </ul>

      {/* Detect Observer */}
      {hasMore && <div ref={loaderRef}>Loading More Comments...</div>}
    </div>
  );
};

export default Comments;
