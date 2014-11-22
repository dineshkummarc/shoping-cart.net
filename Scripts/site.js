var storage = window.localStorage;
var shoppingCart = new ShoppingCart();
var store = new Storage();

jQuery(document).ready(function () {
    //Trigger - add product to shopping cart
    $(".products").find("button").click(function (e) {
        e.preventDefault();
        // get data of the selected product
        var data = {};
        //collect data from product
        var $selectedProduct = $(this).parent("div");
        data.pid = $selectedProduct.data("pid");
        data.pname = $selectedProduct.data("pname");
        data.pprice = $selectedProduct.data("pprice");
        data.pimage = $selectedProduct.data("pimage");
        data.pquantity = $selectedProduct.find(".pquantity").val();
        if (!shoppingCart.checkQuantity(data.pquantity)) {
            alert("Invalid quantity");
            $selectedProduct.find(".pquantity").val(1)
            return;
        }
        //prepare new JASON -> update cart
        shoppingCart.add(data)

    });
    //build shopping cart page
    if ($(".shoppingCartCanvas").length) {
        shoppingCart.insertHTML(shoppingCart.show(0, ''), 0, $(".shoppingCartCanvas"));
    }
    if ($(".cartSummery").length) {
        data = $('#cartData').text();
        shoppingCart.insertHTML(shoppingCart.show(1, data), 0, $(".cartSummery"));
    }

    shoppingCart.trigers();
});

/**
*shopping cart functionality
*/
function ShoppingCart() {
    var itemsPage = 3;
    var currentPage = 0;
    var pageCount;
    var GST = 8;

    //initiate cart function
    this.show = function (mode, data) {
        var store = new Storage();
        try {
            if (this.checkItemsCart() || mode != 0) {

                if (mode == 0)
                    return this.display();
                else
                    return this.displayMiniCart(data);
            }
            else {
                return this.emptyCart();
            }
        }
        catch (e) {
            //add clear button
            shoppingCart.insertHTML(shoppingCart.clearShoppingCartButton(), 1, $(".shoppingCartCanvas"));
            alert(e);
            alert(JSON.stringify(this.getCart()))
        }
    }
    //start display items
    this.display = function () {
        var cartHTML = new String();
        var cart = this.getCart();
        var cartProducts = cart.cartProducts
        pageCount = 0;

        cartHTML += '<div class="pagerTxt">There is ' + cartProducts.length + ' products on shopping cart.';
        //create the HTML of the cart
        cartHTML += '<table class="paged">';
        cartHTML += '<thead>';
        cartHTML += '<tr>';
        cartHTML += '<th></th>';
        cartHTML += '<th>name</th>';
        cartHTML += '<th>price</th>';
        cartHTML += '<th>quantity</th>';
        cartHTML += '<th>sub total</th>';
        cartHTML += '</tr>';
        cartHTML += '</thead>';
        for (itemCout = 0; itemCout < cartProducts.length; itemCout++) {

            if (itemCout == 0 || itemCout % itemsPage == 0) {
                cartHTML += '<tbody class="page_' + pageCount + '">';
                pageCount++;
            }
            cartProduct = cartProducts[itemCout];
            var productSum = (cartProduct.pquantity * cartProduct.pprice);

            cartHTML += '<tr data-pid="' + cartProduct.pid + '">';
            cartHTML += '<td><img src="' + cartProduct.pimage + '" alt="" width="100" height="100"/></td>';
            cartHTML += '<td class="title">' + cartProduct.pname + '</td>';
            cartHTML += '<td class="price">' + cartProduct.pprice + '</td>';
            cartHTML += '<td class="qua"><input type="number" value="' + cartProduct.pquantity + '" class="pquantity"><button><span>update</span></button></td>';
            cartHTML += '<td class="sum" align="center">' + productSum + '</td>';
            cartHTML += '<td class="delete"><button><span>delete</span></button></td>';
            cartHTML += '</tr>';
            if (itemCout == 2 || itemCout % itemsPage == 2) {
                cartHTML += '</tbody>';
            }
        }
        if (itemCout < 2 || itemCout % itemsPage < 2) {
            cartHTML += '</tbody>';
        }
        cartHTML += '</table>';
        cartHTML += this.subTotal(cart);
        if (pageCount > 1)
            cartHTML += this.getPager(pageCount, itemCout);
        if (itemCout > 0)
            cartHTML += '<div class="checkoutButton"><a href="/MVc_Assignment2/Orders"><span>checkout</span></a></div>';

        cartHTML += '<script type="text/javascript">shoppingCart.trigers();shoppingCart.initiatePager(' + currentPage + ');</script>';
        return cartHTML;
    }
    //Mini cart version
    this.displayMiniCart = function (data) {
        var cartHTML = new String();

        dataJson = JSON.parse(data);
        var cartProducts = dataJson.cartProducts
        //create the HTML of the cart
        cartHTML += '<table class="paged">';
        cartHTML += '<thead>';
        cartHTML += '<tr>';
        cartHTML += '<th></th>';
        cartHTML += '<th>name</th>';
        cartHTML += '<th>price</th>';
        cartHTML += '<th>quantity</th>';
        cartHTML += '<th>sub total</th>';
        cartHTML += '</tr>';
        cartHTML += '</thead>';
        for (itemCout = 0; itemCout < cartProducts.length; itemCout++) {

            cartProduct = cartProducts[itemCout];
            var productSum = (cartProduct.pquantity * cartProduct.pprice);

            cartHTML += '<tr data-pid="' + cartProduct.pid + '">';
            cartHTML += '<td><img src="' + cartProduct.pimage + '" alt="" width="100" height="100"/></td>';
            cartHTML += '<td class="title">' + cartProduct.pname + '</td>';
            cartHTML += '<td class="price">' + cartProduct.pprice + '</td>';
            cartHTML += '<td class="qua">' + cartProduct.pquantity + '</td>';
            cartHTML += '<td class="sum" align="center">' + productSum + '</td>';
            cartHTML += '</tr>';
        }
        cartHTML += '</table>';
        cartHTML += this.subTotal(dataJson);

        return cartHTML;
    }

    //display cart total
    this.total = function (data) {
        var productsSum = 0;
        var cart = data;

        var cartProducts = cart.cartProducts
        for (itemCout = 0; itemCout < cartProducts.length; itemCout++) {
            cartProduct = cartProducts[itemCout];
            var productSum = (cartProduct.pquantity * cartProduct.pprice);
            productsSum += productSum;
        }
        return productsSum;
    }
    //get the payment summery
    this.subTotal = function (data) {
        var cartHTML = new String();
        var total = this.total(data);

        var totalGST = total / 1 * (GST / 100)
        var totalNoGST = total - totalGST;
        cartHTML += '<ul class="total">';
        cartHTML += '<li><b>total (no GST)</b><span>' + totalNoGST.toFixed(2) + '</span></li>';
        cartHTML += '<li><b>GST ' + GST + '%</b><span>' + totalGST.toFixed(2) + '</span></li>';
        cartHTML += '<li><b>total</b><span>' + total.toFixed(2) + '</span></li>';
        cartHTML += '</ul>';
        return cartHTML;
    }
    //pager
    this.getPager = function (pageCount) {
        var cartHTML = new String();
        cartHTML += '<div class="pager">';
        cartHTML += '<a href="javascript:void(0)" onclick="shoppingCart.initiatePager(-1)">&lt;</a>';
        for (i = 0; i < pageCount; i++) {
            cartHTML += '<a href="javascript:void(0)" onclick="shoppingCart.initiatePager(' + i + ')">' + (i + 1) + '</a>';
        }
        cartHTML += '<a href="javascript:void(0)" onclick="shoppingCart.initiatePager(999)">&gt;</a>';
        cartHTML += '</div>';
        return cartHTML;

    }
    this.initiatePager = function (pageNum) {
        $this = $("table.paged");
        if (pageNum == -1) {
            currentPage--;
            pageNum = currentPage;
        }
        if (pageNum == 999) {
            currentPage++;
            pageNum = currentPage;
        }
        if (pageNum < 0)
            pageNum = 0;
        if (pageNum >= pageCount)
            pageNum = pageCount - 1;

        $this.find("tbody").each(function (index, key) {
            if (index != pageNum)
                $(this).hide();
            else {
                currentPage = pageNum;
                $(this).show(0, '');
            }
        });
    }
    //add selected item to cart
    this.add = function (data) {

        //current cart exist? if not - create one
        if (!this.checkCart()) {
            var newCart = this.new();
        }
        //check if product exist in the cart. if yes - update
        if (!newCart) {
            var isProductExistInCart = this.UpdateProduct(data);
        }

        //if product not exist - create new
        if (!isProductExistInCart) {
            this.addNewProduct(data);
        }
    }
    //returne current cart JSON
    this.getCart = function () {
        return store.get("cart");
    }
    //set current cart JSON
    this.setCart = function (data) {
        return store.set("cart", data);
    }
    //check if cart is created and have items
    this.checkCart = function () {
        return store.check("cart");
    }
    //check if cart is created and have items
    this.checkItemsCart = function () {
        var currentCartJSON = this.getCart();
        if (this.checkCart()) {
            if (currentCartJSON.cartProducts.length > 0)
                return true;
            else
                return false;
        }
        else
            return false;
    }
    //if no cart - create one
    this.new = function () {

        //crate new cart is not exist
        dataJSON = { "cartProducts": [] };
        this.setCart(dataJSON);
        return true;
    }
    //if item exist - increase quantity
    this.UpdateProduct = function (data) {
        if (this.updateQua(data.pquantity, data.pid)) {
            alert("You successfuly added " + data.pquantity + " item/s of " + data.pname + "' to the cart");
            return true;
        }

        return false;
    }
    //if item not exist - create new one
    this.addNewProduct = function (data) {
        var currentCartJSON = this.getCart();
        var newProductJSON = { "pid": data.pid, "pname": data.pname, "pprice": data.pprice, "pimage": data.pimage, "pquantity": data.pquantity };
        //add product to jSON
        currentCartJSON.cartProducts.push(newProductJSON);
        this.setCart(currentCartJSON);

        alert("You successfuly added  " + data.pquantity + " item/s of " + data.pname + "' to the cart");
    }
    //update item quantity on cart
    this.updateQua = function (pquantity, pid) {

        if (this.checkQuantity(pquantity)) {
            var currentCartJSON = this.getCart();
            for (i = 0; i < currentCartJSON.cartProducts.length; i++) {
                var currentItemJSON = currentCartJSON.cartProducts[i];
                if (currentItemJSON.pid == pid) {
                    //if product exist - increase quantity

                    currentItemJSON.pquantity = pquantity;
                    this.setCart(currentCartJSON);
                    return true;
                }
            }
        }
        return false;

    }
    //Check if quantity is legal number
    this.checkQuantity = function (pquantity) {
        if (!pquantity || pquantity == "" || pquantity < 1 || pquantity / pquantity != 1)
            return false;
        return true;
    }
    //Delete item from cart
    this.deleteProduct = function (pid) {
        var currentCartJSON = this.getCart();
        //build new cart
        this.new();
        var newCartJSON = this.getCart();

        for (i = 0; i < currentCartJSON.cartProducts.length; i++) {
            var currentItemJSON = currentCartJSON.cartProducts[i];
            if (currentItemJSON.pid != pid) {
                //add current item to new cart
                newCartJSON.cartProducts.push(currentItemJSON);
            }
        }
        this.setCart(newCartJSON);
        return true;
        //return false;

    }
    //create clear button
    this.clearShoppingCartButton = function () {
        var buttonHTML = new String();
        buttonHTML += '<button onclick="shoppingCart.clearShoppingCart()"><span>clean shopping cart</span></button>';
        buttonHTML += '<script type="javascript/text">var shoppingCart = new ShoppingCart();</script>';
        return buttonHTML;
    }
    //triger - cleare items
    this.clearShoppingCart = function () {
        if (confirm("Are you sure you like to remove all ites fro shopping cart")) {
            store.clear();
            this.insertHTML(this.emptyCart, 0, $(".shoppingCartCanvas"))

        }
    }
    //print emptycart
    this.emptyCart = function () {
        return "Shopping cart is empty";
    }
    //print HTML to page
    this.insertHTML = function (data, mode, item) {
        if (mode == 1)
            item.append(data);
        else
            item.html(data);
    }
    this.trigers = function () {
        //shopping cart funcionsality
        $(".shoppingCartCanvas").find(".qua button").click(function (e) {
            e.preventDefault;
            var $selectedProduct = $(this).parent(".qua");
            var $pid = $selectedProduct.parent("tr").data("pid");
            var $pquantity = $selectedProduct.find(".pquantity").val();
            if (shoppingCart.updateQua($pquantity, $pid)) {
                shoppingCart.insertHTML(shoppingCart.show(0, ''), 0, $(".shoppingCartCanvas"));

                alert("Quantity has been updated.");
            }
            else {
                alert("Ops.. some error happend!")
            }

        });
        $(".shoppingCartCanvas").find(".delete button").click(function (e) {
            e.preventDefault;
            var $selectedProduct = $(this).parent(".delete");
            var $pid = $selectedProduct.parent("tr").data("pid");
            var $pquantity = $selectedProduct.find(".pquantity").val();

            if (shoppingCart.deleteProduct($pid)) {
                shoppingCart.insertHTML(shoppingCart.show(0, ''), 0, $(".shoppingCartCanvas"));
                alert("Product has been removed.");
            }
            else {
                alert("Ops.. some error happend!")
            }
        });
    }
}
/**
*local storage functionality
*/
function Storage() {

    this.check = function (name) {
        return !!window.localStorage.getItem(name);
    };

    this.get = function (name) {
        return JSON.parse(window.localStorage.getItem(name));
    };
    this.getStr = function (name) {
        return window.localStorage.getItem(name);
    };

    this.set = function (name, value) {
        window.localStorage.setItem(name, JSON.stringify(value));
    };

    this.clear = function () {
        window.localStorage.clear();
    };
}