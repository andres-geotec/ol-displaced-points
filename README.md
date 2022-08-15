# Point displacement

The pointDisplacementSymbol Point Displacement renderer works to visualize all features of a point layer, even if they have the same location. To do this, the renderer takes the points falling in a given Distance tolerance from each other and places them around their barycenter following different Placement methods:

* Ring: places all the features on a circle whose radius depends on the number of features to display.
* Concentric rings: uses a set of concentric circles to show the features.
* Grid: generates a regular grid with a point symbol at each intersection.
The Center symbol widget helps you customize the symbol and color of the middle point. For the distributed points symbols, you can apply any of the No symbols, Single symbol, Categorized, Graduated or Rule-based renderer using the Renderer drop-down list and customize them using the Renderer Settings… button.

While the minimal spacing of the Displacement lines depends on the point symbol renderer’s, you can still customize some of its settings such as the Stroke width, Stroke color and Size adjustment (eg, to add more spacing between the rendered points).

Use the Labels group options to perform points labeling: the labels are placed near the displaced position of the symbol, and not at the feature real position. Other than the Label attribute, Label font and Label color, you can set the Minimum map scale to display the labels.

> Note: Point Displacement renderer does not alter feature geometry, meaning that points are not moved from their position. They are still located at their initial place. Changes are only visual, for rendering purpose. Use instead the Processing Points displacement algorithm if you want to create displaced features.