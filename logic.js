
function filterTable(table_id, query){
  $(table_id + " tr").filter(query);
}
function manFilter(input_id, table_id){
  $(input_id).on("keyup", function () {
    var value = $(this).val().toLowerCase();
    filterTable(table_id, function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
}

function createTable(file, parent, table_id) {
  d3.text(file, function (data) {
      var parsedCSV = d3.csv.parseRows(data);
      /* Ol homemade search bar
      var filter = d3.select(parent).append("div").attr("class", "container-fluid")
          .append("input").attr("class", "form-control-sm").attr("id", table_id + "input").attr("style", "float:right")
          .attr("type", "text").attr("placeholder", "Search..");
      filter.on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#" + table_id + "body" + " tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  }); */

      var table = d3.select(parent)
          .append("div")//.attr("class", "table-wrapper-scroll")
          .append("table").attr("class", "table table-hover w-auto").attr("id", table_id).attr("cellspacing", "0").attr("width", "100%");

      table.append("thead").append("tr")
          .selectAll("th")
          .data(parsedCSV[0]).enter().append("th").text(function (d) {
          return d;
      }).on("click", function (d, i) {
          return sortTable(i, table_id)
      });

      table.append("tbody").attr("id", table_id + "body")
          .selectAll("tr")
          .data(parsedCSV.slice(1)).enter()
          .append("tr")

          .selectAll("td")
          .data(function (d) {
              return d;
          }).enter()
          .append("td")
          .text(function (d) {
              return d;
          });

      $(document).ready(function () {
      $("#"+table_id).DataTable({
"scrollX": true,
"scrollY": "40vh",
          "scrollCollapse": true,
          "paging": false,
          "autowidth": true,
});
$('.dataTables_length').addClass('bs-select');
});
});
}

function sortTable(n, table_id) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(table_id);
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}