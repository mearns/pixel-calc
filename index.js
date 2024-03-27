
function run() {
    const input = document.getElementById("input");
    input.classList.add("busy");

    const canvas = document.getElementById("canvas");

    const errorDiv = document.getElementById("error");
    const onError = (error) => {
        const title = document.createElement("h3");
        title.appendChild(document.createTextNode("Error running code:"))
        errorDiv.appendChild(title);
        errorDiv.appendChild(document.createTextNode(`x = ${Math.round(x)}`))
        errorDiv.appendChild(document.createElement("br"));
        errorDiv.appendChild(document.createTextNode(`y = ${Math.round(y)}`))
        errorDiv.appendChild(document.createElement("br"));
        const subtitle = document.createElement("h4");
        subtitle.appendChild(document.createTextNode("Error:"));
        errorDiv.appendChild(subtitle);
        errorDiv.appendChild(document.createTextNode(error));
        console.error(error);
    };
    setTimeout(() => {
        const newCode = input.value;
        errorDiv.innerHTML = "";

        drawCanvas(newCode, canvas, onError);

        input.classList.remove("busy");
    })
}
