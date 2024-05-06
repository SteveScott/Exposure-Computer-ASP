using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;



using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;


namespace CameraExposureComputer
{
    public class Program
    {
        public static void Main(string[] args)
        {

            var host = WebHost.CreateDefaultBuilder(args)
     .ConfigureServices((context, services) =>
     {
         // Add services to the container.
         services.AddControllers();
     })
     .Configure((context, app) =>
     {
         var env = context.HostingEnvironment;
         if (env.IsDevelopment())
         {
         }

         app.UseHttpsRedirection();
         app.UseHsts();
         app.UseRouting();
         app.UseAuthorization();
         app.UseEndpoints(endpoints =>
         {
             endpoints.MapControllers();
         });
     })
     .Build();
        }
    }
}
