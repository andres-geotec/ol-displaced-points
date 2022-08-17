# Point displacement

Point Displacement methodology works to visualize all features of a point layer, even if they have the same location. To do this, the map takes the points falling in a given Distance tolerance from each other (cluster) and places them around their barycenter following different Placement methods:

> Note: Point Displacement methodology does not alter feature geometry, meaning that points are not moved from their position. Changes are only visual, for rendering purpose. Each barycenter is themselves a cluster with an attribute features that contain the original features.

## Ring
Places all the features on a circle whose radius depends on the number of features to display.
![Ring](./docs/mexico-ring.png)

## Concentric Rings
Uses a set of concentric circles to show the features.
![Concentric Rings](./docs/mexico-concentric-rings.png)

## Spiral
Creates a spiral with the features farthest from the center of the group in each turn.
![Spiral](./docs/mexico-spiral.png)

## Grid
Generates a regular grid with a point symbol at each intersection.
![Grid](./docs/mexico-grid.png)

## others
- (style options)
- (distance between points)

## Attribution

[Qgis Point displacement renderer](https://docs.qgis.org/3.22/en/docs/user_manual/working_with_vector/vector_properties.html#point-displacement-renderer)

[ol-ext: SelectCluster](http://viglino.github.io/ol-ext/examples/animation/map.animatedcluster.html)