using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVc_Assignment2.Controllers
{
    public class HomeController : Controller
    {
        private dataStoreEntities db = new dataStoreEntities();

        public ActionResult Index()
        {

            return View();
        }
        public ActionResult About()
        {

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult Sitemap()
        {

            ViewBag.Message = "Site Map.";

            return View(db.Categories.ToList());
        }
    }
}
