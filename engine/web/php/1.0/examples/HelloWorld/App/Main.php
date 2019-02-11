<?php
Engine::Import()->App();
Engine::Import()->UI();
Engine::Import()->DB();

// I N I T I A L I Z E
$Activity = $App->Activity();

// H E A D
include "Sub/Head.php";

$UI->With($Activity)->Tag("div")->Value("Hello World")->Into($BODY);

// R U N
$App->Run($Activity);
?>