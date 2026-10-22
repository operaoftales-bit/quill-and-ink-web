"use client";

import { useEffect, useState } from "react";
import type { OperaExpression } from "./opera-types";

const expressionCycle: OperaExpression[] = [
  "happy",
  "curious",
  "surprised",
  "mischievous",
  "confused",
  "sleepy",
  "proud",
  "winking",
  "sad",
  "scribing",
];

function getRandomExpression(): OperaExpression {
  return expressionCycle[
    Math.floor(Math.random() * expressionCycle.length)
  ];
}

export function useOperaExpression(pathname: string) {
  const [expression, setExpression] =
    useState<OperaExpression>("happy");

  useEffect(() => {
    setExpression(getRandomExpression());
  }, [pathname]);

  return expression;
}