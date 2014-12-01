
function constrainInsideEnvironment(animat, environment, population)
{
  animat.x = _.clamp(animat.x, 0, environment.width);
  animat.y = _.clamp(animat.y, 0, environment.height);
}
