<?php 

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');  

    date_default_timezone_set("EST");

    require __DIR__ . "/../vendor/autoload.php";

    if(file_exists(__DIR__ . '/../.env')){
        $dotenv = new Dotenv\Dotenv(__DIR__ . '/../');
        $dotenv->load();
    }

    $app = new \Slim\App([
        "settings" => [
            "displayErrorDetails" => true
        ]
    ]);

    $container = $app->getContainer();

    $container['view'] = function ($c) {
        $view = new \Slim\Views\Twig('templates', [
            'cache' => false
        ]);

        // Instantiate and add Slim specific extension
        $basePath = rtrim(str_ireplace('index.php', '', $c['request']->getUri()->getBasePath()), '/');
        $view->offsetSet('rev_parse', ( ! empty($_ENV['SOURCE_VERSION']) ? $_ENV['SOURCE_VERSION'] : exec('git rev-parse HEAD')));
        $view->offsetSet('localhost', ($_SERVER['REMOTE_ADDR'] == "127.0.0.1"));
        $view->offsetSet('ip', $_SERVER['REMOTE_ADDR']);
        $view->offsetSet('jspath', ($_SERVER['REMOTE_ADDR'] == "127.0.0.1" ? '/js' : '/dist/js'));
        $view->offsetSet('base_path', $basePath);
        $view->offsetSet('app_title', getenv('APP_TITLE'));
        $view->offsetSet('currentyear', date('Y'));
        $view->addExtension(new Slim\Views\TwigExtension($c['router'], $basePath));
        
        return $view;
    };

    require __DIR__ . "/routes.php";

    $app->run();