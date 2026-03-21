import { IngredientCategory } from '../types';

export const INGREDIENT_INDEX: IngredientCategory[] = [{
  category: "Whiskey",
  icon: "🥃",
  items: [{
    id: "bourbon",
    name: "Bourbon",
    essential: true,
    brands: ["Buffalo Trace", "Maker's Mark", "Woodford Reserve", "Wild Turkey 101", "Four Roses Single Barrel"]
  }, {
    id: "rye",
    name: "Rye",
    essential: true,
    brands: ["Rittenhouse", "Bulleit Rye", "Sazerac Rye", "High West Double Rye", "Old Overholt"]
  }, {
    id: "scotch",
    name: "Scotch (Blended)",
    essential: false,
    brands: ["Monkey Shoulder", "Johnnie Walker Black", "Famous Grouse", "Dewar's 12"]
  }, {
    id: "blended-scotch",
    name: "Blended Scotch",
    essential: false,
    brands: ["Monkey Shoulder", "Compass Box Great King Street"]
  }, {
    id: "irish-whiskey",
    name: "Irish Whiskey",
    essential: false,
    brands: ["Jameson", "Redbreast 12", "Powers Gold Label"]
  }, {
    id: "japanese-whiskey",
    name: "Japanese Whisky",
    essential: false,
    brands: ["Suntory Toki", "Nikka Coffey Grain", "Hibiki Harmony"]
  }]
}, {
  category: "Gin",
  icon: "🌿",
  items: [{
    id: "gin",
    name: "Gin (Dry)",
    essential: true,
    brands: ["Tanqueray", "Beefeater", "Bombay Sapphire", "Hendrick's", "The Botanist"]
  }, {
    id: "london-dry-gin",
    name: "London Dry Gin",
    essential: false,
    brands: ["Tanqueray", "Beefeater", "Junipero", "Tanqueray No. Ten"]
  }, {
    id: "old-tom-gin",
    name: "Old Tom Gin",
    essential: false,
    brands: ["Haymans Old Tom", "Ransom Old Tom", "Ableforth's Old Tom"]
  }, {
    id: "navy-strength-gin",
    name: "Navy Strength Gin",
    essential: false,
    brands: ["Tanqueray Navy Strength", "Plymouth Navy Strength"]
  }, {
    id: "genever",
    name: "Genever",
    essential: false,
    brands: ["Bols Genever", "Bols Barrel Aged Genever", "The Original Genever"]
  }]
}, {
  category: "Rum",
  icon: "🏝️",
  items: [{
    id: "light-rum",
    name: "Light Rum",
    essential: true,
    brands: ["Bacardi Superior", "Havana Club", "Flor de Caña", "Mount Gay Eclipse", "Appleton Signature Blend"]
  }, {
    id: "gold-rum",
    name: "Gold Rum",
    essential: false,
    brands: ["Bacardi Gold", "Mount Gay XO", "Appleton Estate", "El Dorado 12", "Diplomatico Reserva Exclusiva"]
  }, {
    id: "dark-rum",
    name: "Dark Rum",
    essential: false,
    brands: ["Bacardi 151", "Myers's Original Dark", "Gosling's Black Seal", "Meyers Dark Rum"]
  }, {
    id: "aged-rum",
    name: "Aged Rum",
    essential: false,
    brands: ["Diplomatico Reserva Exclusiva", "Appleton Estate Rare Blend", "El Dorado 15", "Havana Club 7"]
  }, {
    id: "overproof-rum",
    name: "Overproof Rum",
    essential: false,
    brands: ["Smith & Cross", "Appleton Overproof", "Lemonhart 151"]
  }, {
    id: "rhum-agricole",
    name: "Rhum Agricole",
    essential: false,
    brands: ["Rhum Clément", "Rhum JM", "Neisson Blanc"]
  }, {
    id: "cachaca",
    name: "Cachaça",
    essential: false,
    brands: ["Leblon", "Sagatiba", "Novo Fogo"]
  }]
}, {
  category: "Tequila & Mezcal",
  icon: "🌵",
  items: [{
    id: "blanco-tequila",
    name: "Blanco Tequila",
    essential: true,
    brands: ["Patrón Silver", "Cazadores", "El Tesoro de Don Felipe", "Sauza Hornitos", "Don Julio Blanco"]
  }, {
    id: "reposado-tequila",
    name: "Reposado Tequila",
    essential: false,
    brands: ["Patrón Reposado", "El Tesoro Reposado", "Sauza Reposado", "Avión Reposado"]
  }, {
    id: "anejo-tequila",
    name: "Añejo Tequila",
    essential: false,
    brands: ["Patrón Añejo", "Don Julio Real", "Sauza Extra"]
  }, {
    id: "mezcal",
    name: "Mezcal",
    essential: false,
    brands: ["Del Maguey Vida", "Banhez", "Mezcal Negroni", "Sombra Mezcal"]
  }]
}, {
  category: "Vodka",
  icon: "❄️",
  items: [{
    id: "vodka",
    name: "Vodka",
    essential: true,
    brands: ["Ketel One", "Tito's", "Grey Goose", "Belvedere", "Finlandia"]
  }]
}, {
  category: "Brandy",
  icon: "🍇",
  items: [{
    id: "brandy",
    name: "Brandy",
    essential: false,
    brands: ["E&J", "Courvoisier VSOP", "Hennessy XO", "Rémy Martin VSOP"]
  }, {
    id: "cognac",
    name: "Cognac",
    essential: false,
    brands: ["Hennessy VS", "Courvoisier", "Rémy Martin"]
  }, {
    id: "calvados",
    name: "Calvados",
    essential: false,
    brands: ["Boulard Grand Solage", "Château de Breuil"]
  }, {
    id: "pisco",
    name: "Pisco",
    essential: false,
    brands: ["Pisco Porton", "Pisco BarrÑ", "Macchu Pisco"]
  }, {
    id: "applejack",
    name: "Applejack",
    essential: false,
    brands: ["Laird's Bonded Applejack"]
  }]
}, {
  category: "Vermouth & Aperitivi",
  icon: "🍸",
  items: [{
    id: "sweet-vermouth",
    name: "Sweet Vermouth",
    essential: true,
    brands: ["Martini Rosso", "Carpano Antica Formula", "Noilly Prat Rouge", "Dolin de Chambéry"]
  }, {
    id: "dry-vermouth",
    name: "Dry Vermouth",
    essential: true,
    brands: ["Noilly Prat Original", "Martini Extra Dry", "Dolin de Chambéry", "Tribuno Extra Dry"]
  }, {
    id: "blanc-vermouth",
    name: "Blanc Vermouth",
    essential: false,
    brands: ["Dolin de Chambéry", "Carpano Antica Formula Vermouth Bianco"]
  }, {
    id: "campari",
    name: "Campari",
    essential: true,
    brands: ["Campari"]
  }, {
    id: "aperol",
    name: "Aperol",
    essential: false,
    brands: ["Aperol"]
  }]
}, {
  category: "Liqueurs",
  icon: "🍯",
  items: [{
    id: "triple-sec",
    name: "Triple Sec",
    essential: true,
    brands: ["Cointreau", "DeKuyper Triple Sec"]
  }, {
    id: "cointreau",
    name: "Cointreau",
    essential: false,
    brands: ["Cointreau"]
  }, {
    id: "grand-marnier",
    name: "Grand Marnier",
    essential: false,
    brands: ["Grand Marnier"]
  }, {
    id: "curacao",
    name: "Curaçao",
    essential: false,
    brands: ["Bols Blue Curaçao", "Senior & Co Curaçao"]
  }, {
    id: "maraschino-liqueur",
    name: "Maraschino Liqueur",
    essential: false,
    brands: ["Luxardo Maraschino", "Maraska Maraschino"]
  }, {
    id: "green-chartreuse",
    name: "Green Chartreuse",
    essential: false,
    brands: ["Chartreuse Verte"]
  }, {
    id: "yellow-chartreuse",
    name: "Yellow Chartreuse",
    essential: false,
    brands: ["Chartreuse Jaune"]
  }, {
    id: "st-germain",
    name: "St-Germain",
    essential: false,
    brands: ["St-Germain"]
  }, {
    id: "amaretto",
    name: "Amaretto",
    essential: false,
    brands: ["Amaretto di Saronno", "Luxardo Amaretto"]
  }, {
    id: "kahlua",
    name: "Kahlúa",
    essential: false,
    brands: ["Kahlúa Original"]
  }, {
    id: "baileys",
    name: "Baileys",
    essential: false,
    brands: ["Baileys Irish Cream"]
  }, {
    id: "creme-de-menthe",
    name: "Crème de Menthe",
    essential: false,
    brands: ["Bols Crème de Menthe"]
  }, {
    id: "creme-de-cacao",
    name: "Crème de Cacao",
    essential: false,
    brands: ["Bols Crème de Cacao White"]
  }, {
    id: "creme-de-violette",
    name: "Crème de Violette",
    essential: false,
    brands: ["Yvette Crème de Violette"]
  }, {
    id: "falernum",
    name: "Falernum",
    essential: false,
    brands: ["John D. Taylor's Velvet Falernum"]
  }, {
    id: "allspice-dram",
    name: "Allspice Dram",
    essential: false,
    brands: ["Bittercreek Allspice Dram"]
  }, {
    id: "benedictine",
    name: "Benedictine",
    essential: false,
    brands: ["Benedictine DOM"]
  }, {
    id: "drambuie",
    name: "Drambuie",
    essential: false,
    brands: ["Drambuie"]
  }, {
    id: "fernet-branca",
    name: "Fernet-Branca",
    essential: false,
    brands: ["Fernet-Branca"]
  }, {
    id: "amaro-nonino",
    name: "Amaro Nonino",
    essential: false,
    brands: ["Amaro Nonino Quintessentia"]
  }, {
    id: "amaro-montenegro",
    name: "Amaro Montenegro",
    essential: false,
    brands: ["Amaro Montenegro"]
  }, {
    id: "cynar",
    name: "Cynar",
    essential: false,
    brands: ["Cynar"]
  }, {
    id: "suze",
    name: "Suze",
    essential: false,
    brands: ["Suze"]
  }, {
    id: "sloe-gin",
    name: "Sloe Gin",
    essential: false,
    brands: ["Sloe Gin Gordon's"]
  }, {
    id: "galliano",
    name: "Galliano",
    essential: false,
    brands: ["Galliano L'Autentico"]
  }, {
    id: "chambord",
    name: "Chambord",
    essential: false,
    brands: ["Chambord"]
  }, {
    id: "orgeat",
    name: "Orgeat",
    essential: false,
    brands: ["BG Reynolds Orgeat", "Monin Orgeat"]
  }, {
    id: "cream-of-coconut",
    name: "Cream of Coconut",
    essential: false,
    brands: ["Coco López", "Amoretti Organic Cream of Coconut"]
  }, {
    id: "passion-fruit-syrup",
    name: "Passion Fruit Syrup",
    essential: false,
    brands: ["Monin Passion Fruit Syrup"]
  }]
}, {
  category: "Bitters",
  icon: "🫒",
  items: [{
    id: "angostura-bitters",
    name: "Angostura Bitters",
    essential: true,
    brands: ["Angostura"]
  }, {
    id: "orange-bitters",
    name: "Orange Bitters",
    essential: false,
    brands: ["Regan's Orange Bitters", "The Bitter Truth Orange Bitters", "Fee Brothers Orange Bitters"]
  }, {
    id: "peychauds-bitters",
    name: "Peychaud's Bitters",
    essential: false,
    brands: ["Peychaud's"]
  }, {
    id: "chocolate-bitters",
    name: "Chocolate Bitters",
    essential: false,
    brands: ["The Bitter Truth Chocolate Bitters"]
  }, {
    id: "celery-bitters",
    name: "Celery Bitters",
    essential: false,
    brands: ["The Bitter Truth Celery Bitters"]
  }]
}, {
  category: "Citrus",
  icon: "🍋",
  items: [{
    id: "lemon-juice",
    name: "Lemon Juice",
    essential: true,
    brands: []
  }, {
    id: "lime-juice",
    name: "Lime Juice",
    essential: true,
    brands: []
  }, {
    id: "orange-juice",
    name: "Orange Juice",
    essential: false,
    brands: []
  }, {
    id: "grapefruit-juice",
    name: "Grapefruit Juice",
    essential: false,
    brands: []
  }]
}, {
  category: "Sweeteners",
  icon: "🍯",
  items: [{
    id: "simple-syrup",
    name: "Simple Syrup (1:1)",
    essential: true,
    brands: []
  }, {
    id: "rich-simple-syrup",
    name: "Rich Simple Syrup (2:1)",
    essential: false,
    brands: []
  }, {
    id: "honey-syrup",
    name: "Honey Syrup",
    essential: false,
    brands: []
  }, {
    id: "agave-syrup",
    name: "Agave Syrup",
    essential: false,
    brands: []
  }, {
    id: "demerara-syrup",
    name: "Demerara Syrup",
    essential: false,
    brands: []
  }, {
    id: "grenadine",
    name: "Grenadine",
    essential: false,
    brands: ["Pommery Grenadine", "BG Reynolds Grenadine", "Monin Grenadine"]
  }, {
    id: "orgeat-syrup",
    name: "Orgeat",
    essential: false,
    brands: ["BG Reynolds Orgeat", "Monin Orgeat"]
  }, {
    id: "cinnamon-syrup",
    name: "Cinnamon Syrup",
    essential: false,
    brands: []
  }, {
    id: "maple-syrup",
    name: "Maple Syrup",
    essential: false,
    brands: []
  }, {
    id: "vanilla-syrup",
    name: "Vanilla Syrup",
    essential: false,
    brands: []
  }]
}, {
  category: "Mixers",
  icon: "🥤",
  items: [{
    id: "club-soda",
    name: "Club Soda",
    essential: false,
    brands: ["Fever Tree Club Soda", "Perrier"]
  }, {
    id: "tonic-water",
    name: "Tonic Water",
    essential: false,
    brands: ["Fever Tree Indian Tonic", "Fever Tree Mediterranean Tonic", "Schweppes"]
  }, {
    id: "ginger-beer",
    name: "Ginger Beer",
    essential: false,
    brands: ["Fever Tree Ginger Beer", "Q Ginger Beer", "The Ginger People"]
  }, {
    id: "ginger-ale",
    name: "Ginger Ale",
    essential: false,
    brands: ["Fever Tree Ginger Ale", "Canada Dry Ginger Ale"]
  }, {
    id: "cola",
    name: "Cola",
    essential: false,
    brands: ["Coca-Cola", "Pepsi"]
  }, {
    id: "coconut-water",
    name: "Coconut Water",
    essential: false,
    brands: ["Vita Coco"]
  }, {
    id: "pineapple-juice",
    name: "Pineapple Juice",
    essential: false,
    brands: []
  }, {
    id: "cranberry-juice",
    name: "Cranberry Juice",
    essential: false,
    brands: []
  }, {
    id: "tomato-juice",
    name: "Tomato Juice",
    essential: false,
    brands: []
  }]
}, {
  category: "Wine & Bubbles",
  icon: "🍾",
  items: [{
    id: "prosecco",
    name: "Prosecco",
    essential: false,
    brands: ["Marca Cuvée Brut", "Prosecco DOC Brut"]
  }, {
    id: "champagne",
    name: "Champagne",
    essential: false,
    brands: ["Moet & Chandon", "Veuve Clicquot", "Pol Roger"]
  }, {
    id: "dry-white-wine",
    name: "Dry White Wine",
    essential: false,
    brands: ["Sauvignon Blanc", "Pinot Grigio"]
  }, {
    id: "red-wine",
    name: "Red Wine",
    essential: false,
    brands: ["Cabernet Sauvignon", "Pinot Noir"]
  }]
}, {
  category: "Dairy & Egg",
  icon: "🥚",
  items: [{
    id: "egg-white",
    name: "Egg White",
    essential: false,
    brands: []
  }, {
    id: "whole-egg",
    name: "Whole Egg",
    essential: false,
    brands: []
  }, {
    id: "heavy-cream",
    name: "Heavy Cream",
    essential: false,
    brands: []
  }, {
    id: "coconut-cream",
    name: "Coconut Cream",
    essential: false,
    brands: []
  }]
}, {
  category: "Pantry",
  icon: "🛒",
  items: [{
    id: "mint",
    name: "Fresh Mint",
    essential: false,
    brands: []
  }, {
    id: "basil",
    name: "Fresh Basil",
    essential: false,
    brands: []
  }, {
    id: "cucumber",
    name: "Fresh Cucumber",
    essential: false,
    brands: []
  }, {
    id: "cinnamon",
    name: "Cinnamon",
    essential: false,
    brands: []
  }, {
    id: "nutmeg",
    name: "Nutmeg",
    essential: false,
    brands: []
  }, {
    id: "black-pepper",
    name: "Black Pepper",
    essential: false,
    brands: []
  }, {
    id: "celery-salt",
    name: "Celery Salt",
    essential: false,
    brands: []
  }, {
    id: "worcestershire",
    name: "Worcestershire Sauce",
    essential: false,
    brands: ["Lea & Perrins"]
  }, {
    id: "hot-sauce",
    name: "Hot Sauce",
    essential: false,
    brands: []
  }, {
    id: "tabasco",
    name: "Tabasco",
    essential: false,
    brands: ["Tabasco Sauce"]
  }, {
    id: "vanilla-extract",
    name: "Vanilla Extract",
    essential: false,
    brands: []
  }, {
    id: "rose-water",
    name: "Rose Water",
    essential: false,
    brands: []
  }, {
    id: "orange-flower-water",
    name: "Orange Flower Water",
    essential: false,
    brands: []
  }, {
    id: "coffee",
    name: "Coffee",
    essential: false,
    brands: []
  }, {
    id: "espresso",
    name: "Espresso",
    essential: false,
    brands: []
  }, {
    id: "sugar",
    name: "Sugar",
    essential: false,
    brands: []
  }, {
    id: "sugar-cube",
    name: "Sugar Cubes",
    essential: false,
    brands: []
  }, {
    id: "olive",
    name: "Olives",
    essential: false,
    brands: []
  }, {
    id: "olive-brine",
    name: "Olive Brine",
    essential: false,
    brands: []
  }, {
    id: "cherry",
    name: "Cocktail Cherries (Luxardo)",
    essential: false,
    brands: ["Luxardo Maraschino Cherries"]
  }]
}];
