<div class="columns">
  <div class="column">
    <ul class="categories home-categories" itemscope itemtype="http://www.schema.org/ItemList">
      <li>
        <!-- IF !categories.link -->
        <h4><a href="{relative_path}/category/{categories.slug}">{categories.name}</a></h4>
        <!-- ELSE -->
        <h4><a href="{categories.link}">{categories.name}</a></h4>
        <!-- ENDIF !categories.link -->
        <p>{categories.descriptionParsed}</p>
      </li>
    </ul>
  </div>
</div>
