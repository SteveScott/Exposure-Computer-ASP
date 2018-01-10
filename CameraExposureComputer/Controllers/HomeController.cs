using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CameraExposureComputer.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace CameraExposureComputer.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {   //Ibrahim's code
            //IEnumerable<SelectListItem> enumList = Enum.GetValues(typeof(LightLevel))
            //    .Cast<LightLevel>()
            //    .Select(l => new SelectListItem
            //    {
            //        Text = l.ToString(),
            //        Value = ((int)l).ToString()
            //    }
            //        );

            IndexViewModel indexModel = new IndexViewModel();
            //indexModel.LightLevels = enumList;
            //ViewData["LightLevels"] = enumList;
            return View(indexModel);
        }

        [HttpPost]
        public IActionResult Index(IndexViewModel model)
        {
            return View(model);
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        [HttpGet]
        public IActionResult Contact()
        {
            ContactViewModel emptyModel = new ContactViewModel();

            return View(emptyModel);
        }

        [HttpPost]
        public IActionResult Contact(ContactViewModel model)
        {
            ViewData["Message"] = "Your contact page.";

            return RedirectToAction("About");
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
