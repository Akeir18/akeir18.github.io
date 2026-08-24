async function loadComponent(id, file) {
    const exists = document.getElementById(id);
    if (!exists) {
        return;
    }
    const response = await fetch(file);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}

loadComponent("header", "../components/header.html");
loadComponent("footer", "../components/footer.html");