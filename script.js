// Global variables
let ToolboxClosedWidth = 2;     // Screen percentage of toolbox width when closed
let ToolboxOpenedWidth = 16;    // Screen percentage of toolbox width when opened
let GridHeight = 10;            // Number of lines in art grid
let GridWidth = 10;             // Number of columns in art grid
const MinimumGridHeight = 10;   // Minimum number of lines in art grid
const MinimumGridWidth = 10;    // Minimum number of columns in art grid
const MaximumGridHeight = 100;  // Maximum number of lines in art grid
const MaximumGridWidth = 100;   // Maximum number of columns in art grid
let CellBorderSize = 2;         // Size of cell border   
let CurrentColor = "";          // Current selected color
let DrawingOn = false;          // Drawing or not drawing ?
// Available colors : friendly name and hexadecimal value (without #) separated by comma, 1st color is default
let Colors = [
    "Blanc,ffffff",
    "Noir,000000",
    "Argenté,c0c0c0", 
    "Vert forêt,228b22", 
    "Citron vert,00ff00", 
    "Bleu,0000ff",
    "Bleu ciel profond,00bfff",
    "Jaune,ffff00",
    "Orange,ffa500",
    "Rouge,ff0000",
    "Brun,8b4513",
    "Magenta,ff00ff"];
let ColorValues = [];       // Only hexadecimal color values used to save and load grid
let ColorCodes = [];        // Codes matching color values used to save and load grid


// Show splash screen
function ShowScreen()
{

    let SplashScreen = document.getElementById("SplashScreen");
    let ArtGrid = document.getElementById("ArtGrid");
    let Toolbox = document.getElementById("Toolbox");

    SplashScreen.style.display = "none";
    ArtGrid.style.display = "flex";
    Toolbox.style.display = "block";

    CreateGrid();
    DrawToolbox();

}


// Create grid of div for drawing
function CreateGrid()
{
    let GridWidthLabel = document.getElementById("GridWidthLabel");
    GridWidthLabel.innerHTML = "largeur (" + GridWidth + ")";
    let GridHeightLabel = document.getElementById("GridHeightLabel");
    GridHeightLabel.innerHTML = "hauteur (" + GridHeight + ")";

    let ArtGrid = document.getElementById("ArtGrid");
    ArtGrid.innerHTML = "";

    for (Line = 0; Line < GridHeight; Line++)
    {
        Cells = "";
        for (Column = 0; Column < GridWidth; Column++)
        {
            Cells += "<div class='GridCell' style='background-color: #000000;' onmousedown='SwitchDrawing(true, this);' onmouseup='SwitchDrawing(false);' onmouseover='Draw(this);'></div>";
        }
        ArtGrid.innerHTML += "<div>" + Cells + "</div>";
    }

    UpdateCellSize();

}


// Check new grid size
function CheckGridSize()
{
    
    let GridWidthField = document.getElementById("GridWidth");
    let NewGridWidth = GridWidthField.value;
    let GridHeightField = document.getElementById("GridHeight");
    let NewGridHeight = GridHeightField.value;

    AlertMessage = ""
    if (NewGridWidth < MinimumGridWidth || NewGridWidth > MaximumGridWidth)
        AlertMessage += "La largeur doit être comprise entre " + MinimumGridWidth + " et " + MaximumGridWidth + ".\n";
    if (NewGridHeight < MinimumGridHeight || NewGridHeight > MaximumGridHeight)
        AlertMessage += "La hauteur doit être comprise entre " + MinimumGridHeight + " et " + MaximumGridHeight + ".";
    if (AlertMessage != "")
    {
        alert(AlertMessage);
        return;
    }
    
    Confirm = confirm("Êtes-vous sûr de vouloir modifier la taille de la grille ?\n(le dessin sera perdu)");
    if (Confirm)
    {
        GridWidth = NewGridWidth;
        GridHeight = NewGridHeight;
        GridWidthField.value = "";
        GridHeightField.value = "";
        CreateGrid();
    }
        
}


// Change grid cells size
function UpdateCellSize()
{

    let CellWidth = Math.floor(window.innerWidth / GridWidth * 1);
    let CellHeight = Math.floor(window.innerHeight / GridHeight * 0.75);
    
    let Cells = document.getElementsByClassName("GridCell");

    for (Index = 0; Index < Cells.length; Index++)
    {
        // Cells[Index].setAttribute("style", "width: " + CellWidth + "px");
        Cells[Index].style.width = CellWidth + "px";
        Cells[Index].style.height = CellHeight + "px";
    }

}


// Draw toolbox with colors and buttons
function DrawToolbox()
{

    let ColorPalette = document.getElementById("ColorPalette");
    ColorValues = [];
    
    for (Index = 0; Index < Colors.length; Index++)
    {
        let ColorName = Colors[Index].split(",")[0];
        let ColorValue = Colors[Index].split(",")[1];
        ColorPalette.innerHTML += "<div class='ColorPicker' style='background: #" + ColorValue + "' title='" + ColorName + "' onmousedown='ChangeColor(this);'></div>";
        ColorValues.push(GetColor(ColorValue));
        ColorCodes.push(String.fromCharCode(97 + Index));
    }
   
    ChangeColor(null);

    let GridWidthField = document.getElementById("GridWidth");
    GridWidthField.placeholder = "entre " + MinimumGridWidth + " et " + MaximumGridWidth;
    let GridHeightField = document.getElementById("GridHeight");
    GridHeightField.placeholder = "entre " + MinimumGridHeight + " et " + MaximumGridHeight;

    ShowToolbox(true);

}


// Show or hide toolbox
function ShowToolbox(Status)
{

    let ArtGrid = document.getElementById("ArtGrid");
    let Toolbox = document.getElementById("Toolbox");
    let ToolboxElements = Toolbox.querySelectorAll("div");
    
    let ToolboxElementDisplay = "flex";
    let ToolboxActualWidth = ToolboxOpenedWidth;
    if (!Status) 
    {
        ToolboxElementDisplay = "none";
        ToolboxActualWidth = ToolboxClosedWidth;
    }
    let GridWidthPercent = 100 - ToolboxActualWidth;

    for (Element of ToolboxElements)
    {
        Element.style.display = ToolboxElementDisplay;
    }

    ArtGrid.style.width = GridWidthPercent + "%";  
    Toolbox.style.width = ToolboxActualWidth + "%";  
    
}


// Switch pen on or off
function SwitchDrawing(Status, Cell)
{

    DrawingOn = Status;
    Draw(Cell);

}


// Draw (change cell color)
function Draw(Cell)
{

    if (DrawingOn)
        Cell.style.backgroundColor = CurrentColor;

}


// Fill grid
function FillGrid()
{
    
    Confirm = confirm("Êtes-vous sûr de vouloir remplir la grille avec la couleur sélectionnée ?");
    if (Confirm)
    {
        let GridCells = document.getElementById("ArtGrid").querySelectorAll("div > div");
        for (Cell of GridCells)
        {
            Cell.style.backgroundColor = CurrentColor;
        }
    }

}


// Save grid data (current color, grid size and grid content) to cookie
function SaveGrid()
{

    document.cookie = "selectedcolor=" + CurrentColor;
    document.cookie = "gridsize=" + GridWidth + "x" + GridHeight;

    let GridContent = "";
    let GridCells = document.getElementById("ArtGrid").querySelectorAll("div > div");
    for (Cell of GridCells)
    {
        CellColor = GetColor(Cell.style.backgroundColor);
        ColorIndex = ColorValues.indexOf(CellColor);
        ColorCode = ColorCodes[ColorIndex];
        GridContent += ColorCode;
    }
    // console.log(GridContent);
    document.cookie = "gridcontent=" + GridContent;

    alert("Les donnée ont été sauvegardées.");

}


// Load grid data from cookie
function LoadGrid()
{

    Confirm = confirm("Êtes-vous sûr de vouloir charger la grille sauvegardée ?");
    if (Confirm)
    {
        CurrentColor = GetCookie("selectedcolor");
        let Toolbox = document.getElementById("Toolbox");
        Toolbox.style.borderColor = CurrentColor;

        let GridSize = GetCookie("gridsize").split("x");
        GridWidth = GridSize[0];
        GridHeight = GridSize[1];
        CreateGrid();

        GridContent = GetCookie("gridcontent");
        let GridCells = document.getElementById("ArtGrid").querySelectorAll("div > div");
        Index = 0
        for (Cell of GridCells)
        {
            Cell.style.backgroundColor = ColorValues[ColorCodes.indexOf(GridContent.substring(Index,Index+1))];
            Index++;
        }
    }

}


// Change drawing color
function ChangeColor(ColorPicker)
{

    if (ColorPicker != null)
    {
        CurrentColor = ColorPicker.style.backgroundColor;
    }
    else
        CurrentColor = Colors[0].split(",")[1]
    
    CurrentColor = GetColor(CurrentColor);

    let Toolbox = document.getElementById("Toolbox");
    Toolbox.style.borderColor = CurrentColor;

}


// Returns a comprehensible color
function GetColor(Color)
{

    // console.log("\n---\nColor = " + Color);
    // console.log("Color.toString(16) = " + Color.toString(16));
    // console.log("parseInt(Color, 16) = " + parseInt(Color, 16));
    // console.log("parseInt(Color, 16).toString(16) = " + parseInt(Color, 16).toString(16));
    // console.log("parseInt(Color.toString(16), 16) = " + parseInt(Color.toString(16), 16));
    if (Color.startsWith("rgb"))
    {
        // color is rgb(int, int, int) format
        ColorComponents = Color.replace("rgb(","").replace(")","").split(",");
        // console.log("ColorComponents = " + ColorComponents);
        ColorValue = "#";
        for (i = 0; i < ColorComponents.length; i++)
        {
            HexaValue = parseInt(ColorComponents[i]).toString(16)
            ColorValue += (HexaValue.length == 2) ? HexaValue : "0" + HexaValue
            // console.log("ColorValue = " + ColorValue);
        }
    }
    else if (parseInt(Color, 16) === parseInt(Color.toString(16), 16))
    {
        // color is a valid hexadecimal value
        ColorValue = "#" + Color;
    }
    else
    {
        // console.log("pas de traitement...");
        ColorValue = Color;
    }
    
    // console.log("ColorValue = " + ColorValue);
    return ColorValue;

}


// Get value of a specific cookie from document.cookie
// from https://www.w3schools.com/js/js_cookies.asp 
function GetCookie(Name) 
{

    Name += "=";
    let Cookies = document.cookie.split(';');
    
    for (i = 0; i < Cookies.length; i++) 
    {
      let Cookie = Cookies[i];
      while (Cookie.charAt(0) == ' ') 
      {
        Cookie = Cookie.substring(1);
      }
      if (Cookie.indexOf(Name) == 0) 
      {
        return Cookie.substring(Name.length, Cookie.length);
      }
    }

    return "";

  }