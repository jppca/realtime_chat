<?php

namespace Drupal\realtime_chat\Controller;

use Drupal\Core\Controller\ControllerBase;

class ChatController extends ControllerBase {

  public function chatPage() {
    return [
      '#theme' => 'realtime_chat',
      '#attached' => [
        'library' => [
          'realtime_chat/realtime_chat',
        ],
      ],
    ];
  }
}
