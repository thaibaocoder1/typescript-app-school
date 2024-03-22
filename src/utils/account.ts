export function renderAccountInfo(selector: string) {
  const accountInfo = document.getElementById(selector) as HTMLDivElement;
  if (!accountInfo) return;
  const child = accountInfo.children as HTMLCollection;
  if (child) {
    const [login, register] = child;
    const loginAnchor = login as HTMLAnchorElement;
    const registerAnchor = register as HTMLAnchorElement;
    loginAnchor.href = "account.html";
    loginAnchor.textContent = "Account";
    registerAnchor.remove();
  }
}
export function renderSidebarAccount(idElement: string) {
  const sidebar = document.getElementById(idElement);
  if (!sidebar) return;
  sidebar.textContent = "";
  try {
    ["Change infomation", "Update password", "Orders", "Logout"].forEach(
      (name) => {
        const linkElement = document.createElement("a");
        linkElement.className = `nav-item nav-link ${name
          .toLowerCase()
          .replace(/\s/g, "-")}`;
        linkElement.href = name.toLowerCase().replace(/\s/g, "-") + ".html";
        linkElement.textContent = name;
        sidebar.appendChild(linkElement);
      }
    );
  } catch (error) {
    console.log(error);
  }
}
