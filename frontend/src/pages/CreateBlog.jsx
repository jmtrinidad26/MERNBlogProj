import React, { useState } from "react";
import { createPost } from "../api";
export function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    let submitObject = {
      title: title,
      description: description,
      content: content,
      author: null,
      date: new Date(),
    };
    let ds = await console.log(submitObject)
    await createPost(submitObject);
  };

  return (
    <form onSubmit={() =>handleSubmit}>
      <label htmlFor="">Blog Title:</label>
      <input
        type="text"
        name="title"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        maxLength={10}
        required
      ></input>
      <label htmlFor="">Description:</label>
      <input
        type="text"
        name="description"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        maxLength={50}
      />{" "}
      {/** max length for max num of characs */}
      <label htmlFor="">Content:</label>
      <textarea
        type="text"
        name="content"
        onChange={(e) => {
          setContent(e.target.value);
        }}
        maxLength={5000}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
