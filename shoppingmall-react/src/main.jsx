/**
 * 앱 진입점 (Entry Point)
 *
 * 사용처: index.html의 <script type="module" src="/src/main.jsx">
 *
 * 1. initData(): public/data/ 아래 JSON(products, categories, magazine, users)을
 *    fetch해서 localStorage에 저장 (프로토타입용 더미 데이터)
 * 2. createRoot(): index.html의 #root div에 React 앱을 마운트
 */
import { createRoot } from "react-dom/client";
import { initData } from "@/lib/api";
import App from "./app/App";
import "./styles/index.css";

/** JSON 더미 데이터를 localStorage에 초기화한 뒤 React 앱 마운트 */
async function bootstrap() {
  await initData(); // 상품, 카테고리, 매거진, 유저 데이터 준비
  createRoot(document.getElementById("root")).render(<App />);
}
bootstrap();
