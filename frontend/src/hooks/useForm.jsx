import React from "react";
import { useState } from "react";

export const useForm = (initialObject = {}) => {
  const [form, setForm] = useState(initialObject);

  const changed = ({ target }) => {
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });

  };

  return {
    form,
    changed,
  };
};
