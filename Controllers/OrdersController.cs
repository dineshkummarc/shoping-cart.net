using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using MVc_Assignment2.Filters;
using MVc_Assignment2.Models;


namespace MVc_Assignment2.Controllers
{
    public class OrdersController : Controller
    {
        private dataStoreEntities db = new dataStoreEntities();

        /**
         * Check out form
         */
        [Authorize]
        [InitializeSimpleMembership]
        public ActionResult Index()
        {
            //get the user Id of loged in user
            MembershipUser user = Membership.GetUser(User.Identity.Name);
            ViewBag.UserId = user.ProviderUserKey;

            return View();
        }
        /**
         * Checkout page - save data in DB
         */
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(Order order)
        {
            if (ModelState.IsValid)
            {
                db.Orders.Add(order);
                db.SaveChanges();
                return RedirectToAction("Summery/" + order.OrderId);
            }
            return View(order);
        }


        /**
         * Summery of the order
         * GET: /Orders/Summery/5
         */
        [Authorize]
        [InitializeSimpleMembership]
        public ActionResult Summery(int id = 0)
        {
            //get the user id of a log in user
            MembershipUser user = Membership.GetUser(User.Identity.Name);
            Int32 UserId = (Int32)user.ProviderUserKey;

            Order order = db.Orders.Find(id);
            //sec - prevent from login user to watch private pages
            if (order == null || UserId != order.UserId)
            {
                return HttpNotFound();
            }
            return View(order);
        }



        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

    }
}