<?php

namespace Drupal\realtime_chat\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\user\Entity\User;

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

  public function saveMessage(Request $request) {
    $user = $request->request->get('messageUser');
    $message = $request->request->get('messageText');
    $created = $request->request->get('messageCreated');

    \Drupal::database()->insert('chat_messages')
      ->fields([
        'user' => $user,
        'message' => $message,
        'created' => $created,
      ])
      ->execute();

    return new JsonResponse(['status' => 'ok']);
  }

  public function getMessages() {
    try {
      $result = \Drupal::database()->select('chat_messages', 'c')
        ->fields('c', ['id', 'user', 'message', 'created'])
        ->execute()
        ->fetchAll();

      $messages = [];
      foreach ($result as $record) {
        $user = $record->user;
        $messages[] = [
          'id' => $record->id,
          'messageUser' => $user ? $user : 'Anonymous',
          'messageText' => $record->message,
          'messageCreated' => $record->created,
        ];
      }

      return new JsonResponse($messages);
    } catch (\Exception $e) {
      watchdog_exception('realtime_chat', $e);
      return new JsonResponse(['error' => 'An error occurred while retrieving messages'], 500);
    }
  }
}
