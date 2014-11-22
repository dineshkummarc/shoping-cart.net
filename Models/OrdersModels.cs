using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MVc_Assignment2
{
    public class OrdersModels
    {
        //Order Data
        [Display(Name = "Order number")]
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public string Cart { get; set; }
        [Display(Name = "Amout to pay")]
        public Nullable<decimal> Payment { get; set; }
        //Shipping Data
        public int Status { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z ]+$", ErrorMessage = "Use only Alphabets characters.")]
        [Display(Name = "First name")]
        public string FName { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z ]+$", ErrorMessage = "Use only Alphabets characters.")]
        [Display(Name = "Last name")]
        public string LName { get; set; }
        [Required]
        [Display(Name = "Shipping Address")]
        public string Address { get; set; }
        [Required]
        [Display(Name = "City")]
        public string City { get; set; }
        [Required]
        [Display(Name = "State")]
        public string State { get; set; }
        [Required]
        [RegularExpression(@"^[0-9]{4}$", ErrorMessage = "Zip Code is invalid.")]
        [Display(Name = "Zip Code")]
        public string Zipcode { get; set; }

        //Creadit Cart Data
        [Required]
        [RegularExpression(@"^[a-zA-Z ]+$", ErrorMessage = "Use only Alphabets characters.")]
        [Display(Name = "Name on the card")]
        public string CCName { get; set; }
        [Required]
        [RegularExpression(@"^[0-9 ]+$", ErrorMessage = "Credit card number is invalid.")]
        [Display(Name = "Creadit card number")]
        public string CCNumber { get; set; }
        public string CCNumberHide
        {
            get { return "*********" + CCNumber.Substring(CCNumber.Length - 4, 4); }
            set { CCNumberHide = value; }
        }
        [Required]
        [Display(Name = "Expiretion date")]
        [RegularExpression(@"^[0-9]{2}/[0-9]{2}$", ErrorMessage = "Credit Experetion date is invalid. Please use the format \"mm/yy\"")]
        public string CCDate { get; set; }
        [Required]
        [RegularExpression(@"^[0-9]{3}$", ErrorMessage = "CCV number is invalid. ")]
        [Display(Name = "CCV")]
        public string CCV { get; set; }

    }
}