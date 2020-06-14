$(document).on("shown.bs.collapse", (e) => {
    const targetId = e.target.getAttribute("id");
    const pkgCard = window.pkgCard.current;

    if (targetId === "pkg-detail-collapse")
        pkgCard.scrollToDetails();
});