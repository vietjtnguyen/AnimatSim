
function constrainInsideEnvironment(animat, environment, population)
{
  // TODO: Double check if width and height should be swapped.
  animat.x = _.clamp(animat.x, 0, environment.width);
  animat.y = _.clamp(animat.y, 0, environment.height);
}
