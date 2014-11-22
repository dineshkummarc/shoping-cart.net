using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
/**
 * Catalog Controller
 */
namespace MVc_Assignment2.Controllers
{
    public class CatalogController : Controller
    {
        private dataStoreEntities db = new dataStoreEntities();

        //
        // GET: /Products/
        /**
         * show all categories
         */
        public ActionResult Index()
        {
            return View(db.Categories.ToList());
        }
        /**
         * show all products in the category
         */
        public ActionResult List(int id = 0)
        {
            // get proucts from category id
            var products = db.Products.Where(p => p.CategoryID == id);
            ViewBag.CatName = db.Categories
                .Where(p => p.CategoryID == id).SingleOrDefault();
            return View(products);
        }

        //
        // GET: /Products/Details/5
        /**
         * show product page
         */
        public ActionResult Product(int id = 0)
        {
            Product product = db.Products.Find(id);
            if (product == null)
            {
                return HttpNotFound();
            }
            return View(product);
        }
    }
}