// src/components/Toast.js

import { addToast } from "@heroui/react";
import { RiCloseLine } from "react-icons/ri";

function title(color) {
  switch (color) {
    case "success":
      return "Success";
    case "danger":
      return "Error";
    case "warning":
      return "Warning";
    default:
      return "Info";
  }
}

export function toast({ description, color }) {
  addToast({
    // radius: "none",
    // hideIcon: true,
    title: title(color),
    description,
    variant: "flat",
    color,
    classNames: {
      closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
    },
    closeIcon: <RiCloseLine />,
  });
}
