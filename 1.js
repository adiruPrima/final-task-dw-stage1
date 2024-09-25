// Items
const A = 4550;
const B = 5330;
const C = 8653;

// Display
let quality = 0;

const item = prompt("Enter item:").toLocaleLowerCase();
switch (item) {
  case "a":
    quality = A;
    break;
  case "b":
    quality = B;
    break;
  case "c":
    quality = C;
    break;
  default:
    quality = 69420;
}
const quantity = Number(prompt("Enter amount:"));
const price = calculatePrice(quality, quantity);

alert("Total price: " + price);

// Logic
function calculatePrice(quality, quantity) {
  let total = 0;

  if (quality === 4550) {
    if (quantity > 13) {
      total = quality * quantity - 231 * quantity;
    }
  } else if (quality === 5330) {
    if (quantity > 7) {
      total = quality * quantity;
      const discount = total * 0.23;
      total -= discount;
    }
  } else if (quality === 8653) {
    total = 0;
  } else {
    return "There's no such item";
  }

  if (!total) {
    total = quality * quantity;
  }

  return total;
}
