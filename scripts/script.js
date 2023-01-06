let acceptButton = document.getElementById("acceptButton");
let rowsEl = document.getElementById("rows");
let colsEl = document.getElementById("columns");
let langSelect = document.querySelector("select");
let maximinMethod = document.getElementById("maximin");
let maximaxMethod = document.getElementById("maximax");
let HurwitzMethod = document.getElementById("hurwitz");
let minimaxMethod = document.getElementById("minimax");
let LaplaceMethod = document.getElementById("laplace");
let productCriteriaMethod = document.getElementById("p-criteria");
let allCriteriaMethod = document.getElementById("allCriteria");

//current chosen method
chosenMethod = null;

//the function checks if the matrix dimension is entered correctly, if the data is correct, it returns true, otherwise false
function checkInput() {
    //values of the number of rows and columns
    let rows = Number(rowsEl.value);
    let cols = Number(colsEl.value);
    let lang = langSelect.value;
    if (isNaN(rows) || isNaN(cols)) {
        rowsEl.value = "";
        colsEl.value = "";
        alert(langArr["matSizeError"][lang]);
        throw new Error(langArr["matSizeError"]["en"]);
    };
    if (rows * cols > 10000) {
        rowsEl.value = "";
        colsEl.value = "";
        alert(langArr["hugeMatSize"][lang]);
        throw new Error(langArr["hugeMatSize"]["en"]);
    };
};

//a function that finds all errors in the matrices
function findAllErrors(i, j) {
    //check to the end of row i
    for (j_=j; j_ < cols; j_++) {
        let cell = document.getElementById(`${i}/${j_}`);
        cell = Number(cell.value);
        if (isNaN(cell)) {
            let cell = document.getElementById(`${i}/${j_}`);
            cell.setAttribute("class", "errorCell");
        };
    };
    //check to the end of matrix
    for (i_=i+1; i_ < rows; i_++) {
        for (j_=0; j_ < cols; j_++) {
            let cell = document.getElementById(`${i_}/${j_}`);
            cell = Number(cell.value);
            if (isNaN(cell)) {
                let cell = document.getElementById(`${i_}/${j_}`);
                cell.setAttribute("class", "errorCell");
            };
        };
    };
};

//a function that checks if the matrix cells are filled correctly and creates a global object that contains these matrices for calculations
function checkMatrix() {
    matrix_object = [];
    let lang = langSelect.value;
    for (i=0; i < rows; i++) {
        let row = [];
        for (j=0; j < cols; j++) {
            let cell = document.getElementById(`${i}/${j}`);
            cell = Number(cell.value);
            if (isNaN(cell)) {
                resetCellStyles();
                findAllErrors(i, j);
                alert(langArr["matValueError"][lang]);
                throw new Error(langArr["matValueError"]["en"]);
            };
            row.push(cell);
        };
        matrix_object.push(row);
    };
};

//function that removes a matrix element from an html document
function clearMatrix() {
    let container = document.getElementById("container");
    let findButton = document.getElementById("findButton");
    if (container != null) {
        container.remove();
        findButton.remove();
    };
};

//reset matrix cell styles
function resetCellStyles() {
    let solutionCells = document.getElementsByClassName("solution");
    let errorCells = document.getElementsByClassName("errorCell");
    while (solutionCells.length != 0) {
        solutionCells[0].className = "";
    };
    while (errorCells.length != 0) {
        errorCells[0].className = "";
    };
};

//function that creates a matrix
function createMatrix() {
    checkInput();
    clearMatrix();
    //language adaptation
    let lang = langSelect.value;
    //creating headline
    let para = document.createElement("h2");
    para.setAttribute("class", "lang-matrix");
    para.textContent = langArr["matrix"][lang];
    //creating a block containing matrix with its headline
    let container = document.createElement("div");
    container.setAttribute("id", "container");
    //creation of matrix
    let matrix = document.createElement("div");
    matrix.setAttribute("id", "matrix");
    //class binding for styling
    rows = Number(rowsEl.value);
    cols = Number(colsEl.value);
    matrix.setAttribute("class", "matrix");
    matrix.style.display = "grid";
    matrix.style.setProperty("grid-template-columns", `repeat(${cols}, 46px)`);
    //filling the matrix with cells
    for (i=0; i < rows; i++) {
        for (j=0; j < cols; j++) {
            inp = document.createElement("input");
            inp.setAttribute("type", "text");
            //creation of artificial indices for styling
            inp.setAttribute("id", `${i}/${j}`);
            matrix.appendChild(inp);
        };
    };
    //creating a button for finding solutions
    let findButton = document.createElement("button");
    findButton.setAttribute("id", "findButton");
    findButton.setAttribute("class", "lang-findSolutions")
    findButton.textContent = langArr["findSolutions"][lang];
    //binding the event listener when creating the button that finds the solution
    findButton.addEventListener("click", findSolution);
    //forming block containing matrices with headlines
    container.appendChild(para);
    container.appendChild(matrix);
    //output elements in html document
    let mainBlock = document.querySelector("main");
    mainBlock.append(container);
    mainBlock.append(findButton);
};

//a function that highlights rows according to the passed indices
function markUpSolutions(indicesArray) {
    for (i=0; i < indicesArray.length; i++) {
        for (j=0; j < cols; j++) {
            let cell = document.getElementById(`${indicesArray[i]}/${j}`);
            cell.setAttribute("class", "solution");
        };
    };
};

//an auxiliary function that returns the sum of an array
function getSumOfArray(array) {
    let sumOfArray = 0;
    array.forEach(element => {
        sumOfArray += element;
    });
    return sumOfArray;
};

//an auxiliary function that returns the product of an array
function getProductOfArray(array) {
    let productOfArray = 1;
    array.forEach(element => {
        productOfArray = productOfArray * element;
    });
    return productOfArray;
};

//an auxiliary function that returns the nth column of the matrix
function giveColumn(mat, n) {
    let col = [];
    for (row in mat) {
        col.push(mat[row][n]);
    };
    return col;
};

//is an auxiliary function for finding the maximum in the array
function getMaxOfArray(array) {
    return Math.max.apply(null, array);
};

//is an auxiliary function for finding the maximum in the array
function getMinOfArray(array) {
    return Math.min.apply(null, array);
};

//a function that return minimum value in matrix
function getMinValueOfMatrix(matrix) {
    let minMatrixValue = matrix[0][0];
    for (i=0; i < matrix.length; i++) {
        for (j=0; j < matrix[0].length; j++) {
            if (matrix[i][j] < minMatrixValue) {
                minMatrixValue = matrix[i][j];
            };
        };
    };
    return minMatrixValue;
};

//algorithms for finding solutions due to chosen criteria are below
//function that returns the array of indices of the rows with maximin value
function findMaximin() {
    let minValues = [];
    for (i=0; i < rows; i++) {
        minValues.push(getMinOfArray(matrix_object[i]));
    };
    let maximinValue = getMaxOfArray(minValues);
    let maximinIndices = [];
    for (i=0; i < minValues.length; i++) {
        if (minValues[i] == maximinValue) {
            maximinIndices.push(i);
        };
    };
    return maximinIndices;
};

//function that returns the array of indices of the rows with maximax value
function findMaximax() {
    let maxValues = [];
    for (i=0; i < rows; i++) {
        maxValues.push(getMaxOfArray(matrix_object[i]));
    };
    let maximaxValue = getMaxOfArray(maxValues);
    let maximaxIndices = [];
    for (i=0; i < maxValues.length; i++) {
        if (maxValues[i] == maximaxValue) {
            maximaxIndices.push(i);
        };
    };
    return maximaxIndices;
};

//function that returns the array of indices of the rows with the highest weighted average
function findHurwitz() {
    let alphaHurwitzInput = document.getElementById("alphaHurwitzInput");
    let alphaValue = Number(alphaHurwitzInput.value);
    let weightedAveragesArray = [];
    for (i=0; i < rows; i++) {
        let maxRowValue = getMaxOfArray(matrix_object[i]);
        let minRowValue = getMinOfArray(matrix_object[i]);
        let weightedAverageValue = alphaValue*maxRowValue + (1-alphaValue)*minRowValue;
        weightedAveragesArray.push(weightedAverageValue);
    };
    let maxAverageValue = getMaxOfArray(weightedAveragesArray);
    let HurwitzIndices = [];
    for (i=0; i < weightedAveragesArray.length; i++) {
        if (weightedAveragesArray[i] == maxAverageValue) {
            HurwitzIndices.push(i);
        };
    };
    return HurwitzIndices;
};

//function that returns the array of indices of the rows with minimax value in a regret matrix
function findMinimax() {
    //finding regret matrix
    for (j=0; j < cols; j++) {
        let col = giveColumn(matrix_object, j);
        let maxColValue = getMaxOfArray(col);
        for (i=0; i < rows; i++) {
            matrix_object[i][j] = maxColValue - matrix_object[i][j];
        };
    };
    //finding the array of indices of the rows with maximin value in a regret matrix
    let maxValues = [];
    for (i=0; i < rows; i++) {
        maxValues.push(getMaxOfArray(matrix_object[i]));
    };
    let minimaxValue = getMinOfArray(maxValues);
    let minimaxIndices = [];
    for (i=0; i < maxValues.length; i++) {
        if (maxValues[i] == minimaxValue) {
            minimaxIndices.push(i);
        };
    };
    return minimaxIndices;
};

//function that returns the array of indices of the rows with maximum average value
function findLaplace() {
    let averageValuesArray = [];
    for (i=0; i < rows; i++) {
        averageValuesArray.push(getSumOfArray(matrix_object[i]) / cols);
    };
    let maxAverageValue = getMaxOfArray(averageValuesArray);
    let LaplaceIndices = [];
    for (i=0; i < averageValuesArray.length; i++) {
        if (averageValuesArray[i] == maxAverageValue) {
            LaplaceIndices.push(i);
        };
    };
    return LaplaceIndices;
};

//function that returns the array of indices of the rows with maximum product (multiplication) value
function findProductCriteria() {
    //bringing the matrix values to positive values
    let minMatrixValue = getMinValueOfMatrix(matrix_object);
    if (minMatrixValue <= 0) {
        for (i=0; i < rows; i++) {
            for (j=0; j < cols; j++) {
                matrix_object[i][j] = matrix_object[i][j] + Math.abs(minMatrixValue) + 1
            };
        };
    };
    //finding products of rows
    let productValuesArray = [];
    for (i=0; i < rows; i++) {
        productValuesArray.push(getProductOfArray(matrix_object[i]));
    };
    //finding indices of rows with maximum product
    let maxProductValue = getMaxOfArray(productValuesArray);
    let productCriteriaIndices = [];
    for (i=0; i < productValuesArray.length; i++) {
        if (productValuesArray[i] == maxProductValue) {
            productCriteriaIndices.push(i);
        };
    };
    return productCriteriaIndices;
};

//а function that returns the indices of rows that are the best among all the criteria
function findAllCriteria() {
    //finding all solutions by all criteria
    let solutionIndicesArray = [];
    let sumsOfIndices = {};
    solutionIndicesArray.push(findMaximin());
    solutionIndicesArray.push(findMaximax());
    solutionIndicesArray.push(findHurwitz());
    solutionIndicesArray.push(findMinimax());
    solutionIndicesArray.push(findLaplace());
    solutionIndicesArray.push(findProductCriteria());
    console.log(solutionIndicesArray)
    //search for the quantity with which the indices meet
    solutionIndicesArray.forEach(solutionIndices => {
        solutionIndices.forEach(index => {
            if (!(index in sumsOfIndices)) {
                sumsOfIndices[index] = 1;
            } else {
                sumsOfIndices[index] += 1;
            };
        });
    });
    console.log(sumsOfIndices)
    //finding maximum amount of entries among indices
    let maxAmount = 0;
    for (key in sumsOfIndices) {
        if (sumsOfIndices[key] > maxAmount) {
            maxAmount = sumsOfIndices[key];
        };
    };
    console.log(maxAmount)
    //finding all indices with maximum amount of entries
    let allCriteriaIndices = [];
    for (key in sumsOfIndices) {
        if (sumsOfIndices[key] == maxAmount) {
            allCriteriaIndices.push(key);
        };
    };
    console.log(allCriteriaIndices)
    return allCriteriaIndices;
};

//a main function that finds solution
function findSolution() {
    let lang = langSelect.value;
    //checking if the user chose the criteria
    if (chosenMethod == null) {
        alert(langArr["notChosenMethod"][lang]);
        throw new Error(langArr["notChosenMethod"]["en"]);
    };
    //checking if the matrix is fulfilled correctly
    checkMatrix();
    //cells styling reset
    resetCellStyles();
    //switch call for methods
    let solutionIndicesArray = [];
    switch (chosenMethod) {
        case maximinMethod:
            solutionIndicesArray = findMaximin();
            break;
        case maximaxMethod:
            solutionIndicesArray = findMaximax();
            break;
        case HurwitzMethod:
            checkAlphaHurwitz();
            solutionIndicesArray = findHurwitz();
            break;
        case minimaxMethod:
            solutionIndicesArray = findMinimax();
            break;
        case LaplaceMethod:
            solutionIndicesArray = findLaplace();
            break;
        case productCriteriaMethod:
            solutionIndicesArray = findProductCriteria();
            break;
        case allCriteriaMethod:
            checkAlphaHurwitz();
            solutionIndicesArray = findAllCriteria();
            break;
    };
    //visually mark up solutions
    markUpSolutions(solutionIndicesArray);
};

//function that changes the language
function changeLanguage() {
    let lang = langSelect.value;
    document.title = langArr["site-title"][lang];
    for (key in langArr) {
        let elem = document.querySelector(`.lang-${key}`);
        if (elem != null) {
            elem.textContent = langArr[key][lang];
        };
    };
};

//is an auxiliary function that inserts one element after another element in HTML document
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

//resetting the styles of all panel buttons
function resetMethodStyles() {
    if (chosenMethod !== null) {
        chosenMethod.setAttribute("style", "background-color: none");
        chosenMethod.setAttribute("style", "box-shadow: none");
    };
};

//styling chosen method button
function styleChosenMethod(method) {
    resetMethodStyles();
    method.style.cssText = "background-color: rgb(207, 137, 237); box-shadow: inset 0px 0px 5px 2px rgba(0, 0, 0, 0.6)";
};

//Hurwitz: a function that creates a block with alpha input
function createAlphaHurwitz() {
    let lang = langSelect.value;
    //creating container
    let alphaContainer = document.createElement("div");
    alphaContainer.setAttribute("id", "alphaContainer");
    //creating a string
    let para = document.createElement("p");
    para.setAttribute("class", "lang-alphaHurwitz");
    para.textContent = langArr["alphaHurwitz"][lang];
    //creating an input
    let alphaInput = document.createElement("input");
    alphaInput.setAttribute("type", "text");
    alphaInput.setAttribute("id", "alphaHurwitzInput");
    //forming block containing matrices with headlines
    alphaContainer.appendChild(para);
    alphaContainer.appendChild(alphaInput);
    //output elements in html document
    let dimensionsBlock = document.getElementById("dimensionsAll");
    insertAfter(dimensionsBlock, alphaContainer);
};

//a function that deletes alpha Hurwitz container if exists
function deleteAlphaHurwitz() {
    if (document.getElementById("alphaContainer") !== null) {
        let alphaContainer = document.getElementById("alphaContainer");
        alphaContainer.parentNode.removeChild(alphaContainer);
    };
};

//a function that checks correctness of alpha Hurwitz input
function checkAlphaHurwitz() {
    let lang = langSelect.value;
    let alphaInput = document.getElementById("alphaHurwitzInput");
    let alphaValue = Number(alphaInput.value);
    if (isNaN(alphaValue)) {
        alphaInput.value = "";
        alert(langArr["alphaHurwitzValueError"][lang]);
        throw new Error(langArr["alphaHurwitzValueError"]["en"]);
    };
    if ((alphaValue > 1) || (alphaValue < 0)) {
        alphaInput.value = "";
        alert(langArr["alphaHurwitzValueBoundError"][lang]);
        throw new Error(langArr["alphaHurwitzValueBoundError"]["en"]);
    };
};

//handlers of chosen method buttons are below
function maximinHandler() {
    styleChosenMethod(maximinMethod);
    chosenMethod = maximinMethod;
    //deleting alpha Hurwitz block if exists
    deleteAlphaHurwitz();
};

function maximaxHandler() {
    styleChosenMethod(maximaxMethod);
    chosenMethod = maximaxMethod;
    //deleting alpha Hurwitz block if exists
    deleteAlphaHurwitz();
};

function HurwitzMethodHandler() {
    styleChosenMethod(HurwitzMethod);
    chosenMethod = HurwitzMethod;
    //adding alpha parameter
    if (document.getElementById("alphaContainer") == null) {
        createAlphaHurwitz();
    };
};

function minimaxHandler() {
    styleChosenMethod(minimaxMethod);
    chosenMethod = minimaxMethod;
    //deleting alpha Hurwitz block if exists
    deleteAlphaHurwitz();
};

function LaplaceMethodHandler() {
    styleChosenMethod(LaplaceMethod);
    chosenMethod = LaplaceMethod;
    //deleting alpha Hurwitz block if exists
    deleteAlphaHurwitz();
};

function productCriteriaMethodHandler() {
    styleChosenMethod(productCriteriaMethod);
    chosenMethod = productCriteriaMethod;
    //deleting alpha Hurwitz block if exists
    deleteAlphaHurwitz();
};

function allCriteriaMethodHandler() {
    styleChosenMethod(allCriteriaMethod);
    chosenMethod = allCriteriaMethod;
    //adding alpha parameter
    if (document.getElementById("alphaContainer") == null) {
        createAlphaHurwitz();
    };
};

//listeners to pressing methods buttons
maximinMethod.addEventListener("click", maximinHandler);
maximaxMethod.addEventListener("click", maximaxHandler);
HurwitzMethod.addEventListener("click", HurwitzMethodHandler);
minimaxMethod.addEventListener("click", minimaxHandler);
LaplaceMethod.addEventListener("click", LaplaceMethodHandler);
productCriteriaMethod.addEventListener("click", productCriteriaMethodHandler);
allCriteriaMethod.addEventListener("click", allCriteriaMethodHandler);

//listener to pressing the "Accept" button
acceptButton.addEventListener("click", createMatrix);
//listener to changing the language
langSelect.addEventListener("change", changeLanguage);