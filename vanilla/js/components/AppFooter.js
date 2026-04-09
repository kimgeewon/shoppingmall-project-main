/**
 * @fileoverview 앱 푸터 컴포넌트 (회사 정보, 고객센터, 연락처)
 * @module components/AppFooter
 */

/**
 * 앱 푸터 커스텀 엘리먼트
 * @extends HTMLElement
 */
class AppFooter extends HTMLElement {
 /** @override */
 connectedCallback() {
  this.render();
 }

 /** 푸터 HTML 렌더링 */
 render() {
  this.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>MALL</h3>
              <p>고객의 행복을 최우선으로 생각하는<br />온라인 쇼핑몰입니다.</p>
            </div>
            <div class="footer-section">
              <h4>회사 정보</h4>
              <ul>
                <li><a href="coming-soon.html?from=footer">회사 소개</a></li>
                <li><a href="coming-soon.html?from=footer">채용 정보</a></li>
                <li><a href="coming-soon.html?from=footer">이용약관</a></li>
                <li><a href="coming-soon.html?from=footer">개인정보처리방침</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>고객센터</h4>
              <ul>
                <li><a href="coming-soon.html?from=footer">공지사항</a></li>
                <li><a href="coming-soon.html?from=footer">자주 묻는 질문</a></li>
                <li><a href="coming-soon.html?from=footer">1:1 문의</a></li>
                <li><a href="coming-soon.html?from=footer">배송 안내</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>연락처</h4>
              <address style="font-style: normal">
                <p>1544-0000</p>
                <p>help@mall.com</p>
                <p>평일 09:00 - 18:00</p>
              </address>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2024 MALL Corp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
 }
}

customElements.define("app-footer", AppFooter);

export {};
